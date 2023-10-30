import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Model } from 'mongoose'
import { Server, Socket } from 'socket.io'
import { RedisService } from 'src/modules/redis/redis.service'
import { Group } from './group/group.schema'
import { GroupService } from './group/group.service'
import { EMemberType, Member } from './member/member.schema'
import { MemberService } from './member/member.service'
import { Message } from './message/message.schema'
import { Board } from './team/board/board.schema'
import { Channel } from './team/channel/channel.schema'
import { ChannelService } from './team/channel/channel.service'
import { Team } from './team/team.schema'
import { TeamService } from './team/team.service'

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class WorkspaceService {
  @WebSocketServer()
  server: Server

  constructor(
    private readonly memberService: MemberService,
    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
    @Inject(forwardRef(() => ChannelService))
    private readonly channelSerivce: ChannelService,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,

    @InjectModel(Member.name) private readonly memberModel: Model<Member>,

    private readonly redisService: RedisService
  ) {
    this.listenToExpiredKeys()
    // this.listenToDeletedKeys()
  }

  private async listenToDeletedKeys() {
    await this.redisService.subRedis.psubscribe('__keyspace@0__:del') // Sử dụng số database thích hợp, thay 0 bằng số database của bạn

    this.redisService.subRedis.on('pmessage', async (pattern, channel, key) => {
      console.log('Key deleted:', key)
    })
  }

  private async listenToExpiredKeys() {
    await this.redisService.subRedis.psubscribe(`*:expired`)
    await this.redisService.subRedis.on(
      'pmessage',
      async (pattern, channel, key) => {
        console.log('expired', { pattern, channel, key })

        const [type] = key.split(':d')
        console.log(type)
      }
    )
  }

  private async getKeysByPattern(pattern: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.redisService.redisClient.keys(pattern, (err, keys) => {
        if (err) {
          reject(err)
        } else {
          resolve(keys)
        }
      })
    })
  }

  async subscribeAllRooms(userId: string, client: Socket) {
    const members = await this.memberModel
      .find({
        userId,
        isAvailable: true
      })
      .lean()

    const rooms = members.map(member => {
      switch (member.type) {
        case EMemberType.Team:
          return `team:${member.targetId}`
        case EMemberType.Board:
          return `board:${member.targetId}`
        case EMemberType.Channel:
          return `channel:${member.targetId}`
        case EMemberType.DirectMessage:
          return `directMessage:${member.targetId}`
        case EMemberType.Group:
          return `group:${member.targetId}`
      }
    })

    rooms.push(`user:${userId}`)
    client.join(rooms)

    console.log(userId, client.rooms)
  }

  //#region Typing
  async startTyping(userId: string, targetId: string) {
    this.server
      .to(`channel:${targetId}`)
      .emit('startTyping', { userId, targetId })
    await this.redisService.redisClient.set(
      `typing:${targetId}:${userId}`,
      '',
      'EX',
      3
    )
  }

  async stopTyping(userId: string, targetId: string) {
    await this.redisService.redisClient.del(`typing:${targetId}:${userId}`)
  }

  //#endregion

  //#region Unread
  async incrementUnread(userId: string, targetId: string) {
    const unreadCount = await this.redisService.redisClient.get(
      `unread:${userId}:${targetId}`
    )
    return this.redisService.redisClient.set(
      `unread:${userId}:${targetId}`,
      Number(unreadCount) + 1
    )
  }

  async markAsRead(userId: string, targetId: string) {
    return this.redisService.redisClient.del(`unread:${userId}:${targetId}`)
  }

  async getAllUnreadData(
    userId: string
  ): Promise<{ [key: string]: string | null }> {
    const pattern = `unread:${userId}:*`
    const keys = await this.getKeysByPattern(pattern)

    if (keys.length === 0) {
      return {}
    }

    const unreadData: { [key: string]: string | null } = {}
    const values = await Promise.all(
      keys.map(key => this.redisService.redisClient.get(key))
    )

    keys.forEach((key, index) => {
      const [, targetId] = key.split(':')
      unreadData[targetId] = values[index]
    })

    return unreadData
  }
  //#endregion

  //#region Read
  async markMessageAsRead(userId: string, targetId: string, messageId: string) {
    const key = `read:${targetId}:${userId}`
    return this.redisService.redisClient.set(key, messageId)
  }

  async getReadMessagesForTarget(
    targetId: string
  ): Promise<{ [userId: string]: string }> {
    const key = `read:${targetId}:*`
    const keys = await this.getKeysByPattern(key)

    const readMessages: { [userId: string]: string } = {}
    for (const k of keys) {
      const [, , readUserId] = k.split(':')
      const messageId = await this.redisService.redisClient.get(k)
      readMessages[readUserId] = messageId
    }

    return readMessages
  }
  //#endregion

  //#region Presence
  async getUsersPresence(
    usersId: string[]
  ): Promise<{ [userId: string]: string }> {
    const usersPresence: { [userId: string]: string } = {}
    for (const userId of usersId) {
      const status = await this.redisService.redisClient.get(
        `presence:${userId}`
      )
      usersPresence[userId] = status
    }

    return usersPresence
  }
  //#endregion

  async team({
    rooms,
    data
  }: {
    rooms: string | string[]
    data: {
      team: Team
      action: 'create' | 'update' | 'delete'
    }
  }) {
    this.server.to(rooms).emit('team', data)
  }

  async channel({
    rooms,
    data
  }: {
    rooms: string | string[]
    data: {
      channel: Channel
      action: 'create' | 'update' | 'delete'
    }
  }) {
    this.server.to(rooms).emit('channel', data)
  }

  async board({
    rooms,
    data
  }: {
    rooms: string | string[]
    data: {
      board: Board
      action: 'create' | 'update' | 'delete'
    }
  }) {
    this.server.to(rooms).emit('board', data)
  }

  async group({
    rooms,
    data
  }: {
    rooms: string | string[]
    data: {
      group: Group
      action: 'create' | 'update' | 'delete'
    }
  }) {
    this.server.to(rooms).emit('group', data)
  }

  async member({
    rooms,
    data
  }: {
    rooms: string | string[]
    data: {
      member: Member
      action: 'create' | 'update' | 'delete'
    }
  }) {
    this.server.to(rooms).emit('member', data)
  }

  async message({
    rooms,
    data
  }: {
    rooms: string | string[]
    data: {
      message: Message
      action: 'create' | 'update' | 'delete'
    }
  }) {
    this.server.to(rooms).emit('message', data)
  }

  async getWorkspaceData(userId: string) {
    const _teams = this.teamService.getTeamsByUserId(userId)
    const _channels = this.channelSerivce.getChannelsByUserId(userId)
    const _groups = this.groupService.getGroupsByUserId(userId)

    const [teams, channels, groups] = await Promise.all([
      _teams,
      _channels,
      _groups
    ])
    return { teams, channels, groups }
  }
}
