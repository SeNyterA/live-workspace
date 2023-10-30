import { JwtService } from '@nestjs/jwt'
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { RedisService } from 'src/modules/redis/redis.service'
import { WsClient, WsUser } from './../../decorators/users.decorator'
import { WorkspaceService } from './workspace.service'

export type TJwtUser = {
  email: string
  userName: string
  sub: string
  iat: number
  exp: number
}
export interface CustomSocket extends Socket {
  user: TJwtUser
}

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class WorkspaceGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private connectedUsers: Set<TJwtUser> = new Set()
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}

  async handleConnection(client: CustomSocket, ...args: any[]) {
    try {
      const user = (await this.jwtService.verifyAsync(
        client.handshake.auth.token
      )) as TJwtUser
      client.user = user

      const _log = await this.redisService.redisClient.get(
        `presence:${user.sub}`
      )

      const _status = parseInt(_log) || 0

      if (_status > 0) {
        this.redisService.redisClient.set(`presence:${user.sub}`, _status + 1)
      } else {
        this.redisService.redisClient.set(`presence:${user.sub}`, 1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async handleDisconnect(client: CustomSocket) {
    const time = Date.now().toString()

    const _log = await this.redisService.redisClient.get(
      `presence:${client.user.sub}`
    )

    const _status = parseInt(_log) || 0

    if (_status > 0) {
      this.redisService.redisClient.set(
        `presence:${client.user.sub}`,
        _status - 1
      )
    } else {
      this.redisService.redisClient.set(`presence:${client.user.sub}`, -time)
    }
  }

  @SubscribeMessage('joinTeam')
  async handleJoinTeam(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() teamId: string
  ) {
    console.log('user', user, teamId)
    client.join(`team:${teamId}`)
  }

  @SubscribeMessage('joinBoard')
  async handleJoinBoard(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() boardId: string
  ) {
    client.join(`board:${boardId}`)
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody()
    channelId: string
  ) {
    client.join(`channel:${channelId}`)
  }

  @SubscribeMessage('joinDirectMessage')
  async handleJoinDirectMessage(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody()
    directMessageId: string
  ) {
    client.join(`directMessage:${directMessageId}`)
  }

  @SubscribeMessage('joinGroup')
  async handleJoinGroup(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() groupId: string
  ) {
    client.join(`group:${groupId}`)
  }

  @SubscribeMessage('leaveTeam')
  async handleLeaveTeam(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() teamId: string
  ) {
    console.log(`team:${teamId}`)
    client.leave(`team:${teamId}`)
  }

  @SubscribeMessage('leaveBoard')
  async handleLeaveBoard(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() boardId: string
  ) {
    client.leave(`board:${boardId}`)
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody()
    channelId: string
  ) {
    client.leave(`channel:${channelId}`)
  }

  @SubscribeMessage('leaveDirectMessage')
  async handleLeaveDirectMessage(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody()
    directMessageId: string
  ) {
    client.leave(`directMessage:${directMessageId}`)
  }

  @SubscribeMessage('leaveGroup')
  async handleLeaveGroup(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() groupId: string
  ) {
    client.leave(`group:${groupId}`)
  }

  @SubscribeMessage('startTyping')
  async startTyping(
    @WsUser() user: TJwtUser,
    @MessageBody() { targetId }: { targetId: string }
  ) {
    this.workspaceService.startTyping(user.sub, targetId)
  }

  @SubscribeMessage('stopTyping')
  async stopTyping(
    @WsUser() user: TJwtUser,
    @MessageBody() { targetId }: { targetId: string }
  ) {
    this.workspaceService.stopTyping(user.sub, targetId)
  }

  @SubscribeMessage('joins')
  async joins(@WsUser() user: TJwtUser, @WsClient() client: Socket) {
    this.workspaceService.subscribeAllRooms(user.sub, client)
  }

  @SubscribeMessage('disconnect')
  async disconnect(@WsUser() user: TJwtUser, @WsClient() client: Socket) {
    console.log('disconnect:', 11111)
  }
}
