import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Socket } from 'socket.io'
import { RedisService } from 'src/modules/redis/redis.service'
import { User } from '../users/user.schema'
import { DirectMessage } from './direct-message/direct-message.schema'
import { DirectMessageService } from './direct-message/direct-message.service'
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
import { WorkspaceGateway } from './workspace.gateway'

export type TWorkspaceSocket = {
  action: 'create' | 'update' | 'delete'
} & (
  | { data: Channel; type: 'channel' }
  | { data: Board; type: 'board' }
  | { data: Team; type: 'team' }
  | { data: DirectMessage; type: 'direct' }
  | { data: Group; type: 'group' }
  | { data: Member; type: 'member' }
)

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
    @Inject(forwardRef(() => DirectMessageService))
    private readonly directService: DirectMessageService,

    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    @InjectModel(User.name) private readonly userModel: Model<User>,

    private readonly redisService: RedisService,

    @Inject(forwardRef(() => WorkspaceGateway))
    private readonly socketService: WorkspaceGateway
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
    const directs = await this.directService.directMessageModel.find({
      isAvailable: true,
      userIds: { $in: [userId] }
    })

    const rooms = [
      ...members.map(member => member.targetId.toString()),
      ...directs.map(direct => direct._id.toString()),
      userId
    ]

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

  //#region Unread unread:userId:target
  async _incrementUnread(userId: string, targetId: string) {
    const unreadCount = await this.redisService.redisClient.get(
      `unread:${userId}:${targetId}`
    )

    await this.redisService.redisClient.set(
      `unread:${userId}:${targetId}`,
      Number(unreadCount) + 1
    )

    await this.socketService.server.to([userId]).emit('unReadCount', {
      count: Number(unreadCount) + 1,
      targetId
    })
  }

  async _markAsRead(userId: string, targetId: string) {
    const unreadCount = await this.redisService.redisClient.get(
      `unread:${userId}:${targetId}`
    )
    if (Number(unreadCount) > 0) {
      this.redisService.redisClient.del(`unread:${userId}:${targetId}`)
      this.socketService.server
        .to([userId])
        .emit('unReadCount', { targetId, count: 0 })
    }
  }

  async getAllUnreadData(
    userId: string
  ): Promise<{ [key: string]: string | null | number }> {
    const pattern = `unread:${userId}:*`
    const keys = await this.getKeysByPattern(pattern)

    if (keys.length === 0) {
      return {}
    }

    const unreadData: { [key: string]: string | null | number } = {}
    const values = await Promise.all(
      keys.map(key => this.redisService.redisClient.get(key))
    )

    keys.forEach((key, index) => {
      const [, , targetId] = key.split(':')
      unreadData[targetId] = Number(values[index])
    })

    return unreadData
  }
  //#endregion

  //#region message readed read:targetId:userId:messageId
  async markMessageAsRead(userId: string, targetId: string, messageId: string) {
    const key = `read:${targetId}:${userId}`

    const _messageId = await this.redisService.redisClient.get(key)

    if (_messageId !== messageId) {
      this.redisService.redisClient.set(key, messageId)

      this.socketService.server
        .to([targetId])
        .emit('userReadedMessage', `${targetId}:${userId}:${messageId}`)
      this._markAsRead(userId, targetId)
    }
  }

  async getReadMessagesForTarget(targetId: string): Promise<string[]> {
    const key = `read:${targetId}:*`
    const keys = await this.getKeysByPattern(key)

    const res = await Promise.all(
      keys.map(async key => {
        const messageId = await this.redisService.redisClient.get(key)
        return `${key}:${messageId}`.replace('read:', '')
      })
    )

    return res
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

  async message({
    rooms,
    data
  }: {
    rooms: string[]
    data: {
      message: Message
      action: 'create' | 'update' | 'delete'
    }
  }) {
    await this.socketService.server.to(rooms).emit('message', data)
  }

  async workspaces({
    rooms,
    workspaces
  }: {
    rooms: string[]
    workspaces: TWorkspaceSocket[]
  }) {
    const members = workspaces.filter(
      e => e.type === 'member' && ['create', 'delele'].includes(e.action)
    )
    if (members) {
      const sockets = await this.socketService.server.sockets.fetchSockets()
      members.forEach(member => {
        if (member.type === 'member' && member.action === 'create') {
          sockets
            .filter(e => e.rooms.has(member.data.userId))
            .forEach(_socket => _socket.join(member.data.targetId))
        }
        if (member.type === 'member' && member.action === 'delete') {
          sockets
            .filter(e => e.rooms.has(member.data.userId))
            .forEach(_socket => _socket.leave(member.data.targetId))
        }
      })
    }

    const directs = workspaces.filter(
      e => e.type === 'direct' && e.action === 'create'
    )
    if (directs) {
      const sockets = await this.socketService.server.sockets.fetchSockets()
      directs.forEach(direct => {
        if (direct.type === 'direct' && direct.action === 'create') {
          sockets
            .filter(e => direct.data.userIds.some(_e => e.rooms.has(_e)))
            .forEach(_socket => _socket.join(direct.data._id))
        }
      })
    }

    await this.socketService.server.to(rooms).emit('workspaces', {
      workspaces
    })
  }

  async users({
    rooms,
    users
  }: {
    rooms: string[]
    users: {
      data: User
      type: 'get' | 'update'
    }[]
  }) {
    await this.socketService.server.to(rooms).emit('users', {
      users
    })
  }

  async getWorkspaceData(userId: string) {
    const _teams = this.teamService.getTeamsByUserId(userId)
    const _channels = this.channelSerivce.getChannelsByUserId(userId)
    const _groups = this.groupService.getGroupsByUserId(userId)
    const _directs = this.directService.getDirectsByUserId(userId)

    const [teams, channels, groups, directs] = await Promise.all([
      _teams,
      _channels,
      _groups,
      _directs
    ])

    const userIds = Array.from(
      new Set([
        ...teams.members.map(e => e.userId.toString()),
        ...channels.members.map(e => e.userId.toString()),
        ...groups.members.map(e => e.userId.toString()),
        ...directs.directUserId
      ])
    )

    const users = await this.userModel
      .find({
        _id: { $in: userIds }
      })
      .lean()

    return {
      teams,
      channels,
      groups,
      directs,
      userIds,
      users
    }
  }
}
