import { Inject, forwardRef } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
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
  @WebSocketServer()
  server: Server
  constructor(
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}

  async handleConnection(client: CustomSocket, ...args: any[]) {
    try {
      if (!client?.handshake?.auth?.token) throw new Error('Missing token')

      const user = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        { secret: process.env.JWT_SECRET }
      )

      if (!user?.sub) throw new Error('Invalid user')
      client.user = user

      await this.workspaceService.subscribeAllRooms(user.sub, client)
      await this.redisService.redisClient.set(`presence:${user.sub}`, 'online')
    } catch (error) {
      client.disconnect()
      console.log(error)
    }
  }

  async handleDisconnect(client: CustomSocket) {
    try {
      const userId = client?.user?.sub
      if (!userId) return

      const sockets = await this.server.fetchSockets()
      const userSockets = sockets.filter(socket => socket.rooms.has(userId))
      if (userSockets.length) return
      const time = Date.now().toString()
      await this.redisService.redisClient.set(`presence:${userId}`, time)
    } catch (error) {
      console.log(error)
    }
  }

  @SubscribeMessage('joinTeam')
  async handleJoinTeam(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() teamId: string
  ) {
    client.join(teamId)
  }

  @SubscribeMessage('joinBoard')
  async handleJoinBoard(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() boardId: string
  ) {
    client.join(boardId)
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody()
    channelId: string
  ) {
    client.join(channelId)
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
    client.join(groupId)
  }

  @SubscribeMessage('leaveTeam')
  async handleLeaveTeam(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() teamId: string
  ) {
    client.leave(teamId)
  }

  @SubscribeMessage('leaveBoard')
  async handleLeaveBoard(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody() boardId: string
  ) {
    client.leave(boardId)
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(
    @WsUser() user: TJwtUser,
    @WsClient() client: Socket,
    @MessageBody()
    channelId: string
  ) {
    client.leave(channelId)
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
    client.leave(groupId)
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
  async disconnect(@WsUser() user: TJwtUser, @WsClient() client: Socket) {}

  @SubscribeMessage('makeReadMessage')
  async makeReadMessage(
    @WsUser() user: TJwtUser,
    @MessageBody()
    { targetId, messageId }: { targetId: string; messageId: string }
  ) {
    this.workspaceService.markMessageAsRead(user.sub, targetId, messageId)
    this.workspaceService._markAsRead(user.sub, targetId)
  }
}
