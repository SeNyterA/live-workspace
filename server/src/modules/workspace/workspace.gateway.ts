import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { TJwtUser } from '../adapters/redis-io.adapter'
import { WsClient, WsUser } from './../../decorators/users.decorator'
import { WorkspaceService } from './workspace.service'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class WorkspaceGateway {
  constructor(private readonly workspaceService: WorkspaceService) {}

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
    @WsClient() client: Socket,
    @MessageBody() targetId: string
  ) {
    this.workspaceService.startTyping(user.sub, targetId)
  }

  @SubscribeMessage('joins')
  async joins(@WsUser() user: TJwtUser, @WsClient() client: Socket) {
    this.workspaceService.subscribeAllRooms(user.sub, client)
  }
}
