import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Socket } from 'socket.io'
import { RedisService } from 'src/modules/redis/redis.service'
import { SocketService } from '../socket/socket.service'
import { Group } from './group/group.schema'
import { GroupService } from './group/group.service'
import { Member } from './member/member.schema'
import { MemberService } from './member/member.service'
import { Message } from './message/message.schema'
import { Board } from './team/board/board.schema'
import { Channel } from './team/channel/channel.schema'
import { ChannelService } from './team/channel/channel.service'
import { Team } from './team/team.schema'
import { TeamService } from './team/team.service'

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly memberService: MemberService,
    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
    @Inject(forwardRef(() => ChannelService))
    private readonly channelSerivce: ChannelService,
    @Inject(forwardRef(() => GroupService))
    private readonly groupService: GroupService,

    @InjectModel(Member.name) private readonly memberModel: Model<Member>,

    private readonly redisService: RedisService,
    private readonly socketService: SocketService
  ) {
    this.listenToExpiredKeys()
  }

  private async listenToExpiredKeys() {
    await this.redisService.subRedis.psubscribe(`*:expired`)
    await this.redisService.subRedis.on(
      'pmessage',
      async (pattern, channel, key) => {
        const [type] = key.split(':')

        switch (type) {
          case 'typing':
            const [type, targetId, userId] = key.split(':')
            this.toggleTyping({ targetId, userId, type: 0 })
        }
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

    const rooms = [...members.map(member => member.targetId.toString()), userId]
    client.join(rooms)
  }

  //#region Typing
  async startTyping(userId: string, targetId: string) {
    await this.toggleTyping({ targetId, userId, type: 1 })
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

  async toggleTyping({
    targetId,
    type,
    userId
  }: {
    targetId: string
    userId: string
    type: 0 | 1
  }) {
    this.socketService.server.to([targetId]).emit('typing', {
      userId,
      targetId,
      type
    })
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
    this.socketService.server.to(rooms).emit('team', data)
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
    this.socketService.server.to(rooms).emit('channel', data)
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
    this.socketService.server.to(rooms).emit('board', data)
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
    this.socketService.server.to(rooms).emit('group', data)
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
    this.socketService.server.to(rooms).emit('member', data)
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
    this.socketService.server.to(rooms).emit('message', data)
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
