import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'socket.io'
import { HttpUser } from 'src/decorators/users.decorator'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('events')
  findAll(@HttpUser() user, @MessageBody() data: any) {
    this.server.emit('events', { user: '222222', event: 'left' })
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    this.team()
    return data
  }

  async team(@HttpUser() user?: any) {
    this.server.emit('events', { event: 'create', user })
  }

  // async handleDisconnect(client: CustomSocket) {
  //   this.server.emit('users-changed', {
  //     user: client.user.nickname,
  //     event: 'left'
  //   })
  // }

  // @SubscribeMessage('enter-chat-room')
  // async enterChatRoom(client: CustomSocket, roomId: string) {
  //   client.join(roomId)
  //   client.broadcast
  //     .to(roomId)
  //     .emit('users-changed', { user: client.user.nickname, event: 'joined' })
  // }

  // @SubscribeMessage('leave-chat-room')
  // async leaveChatRoom(client: CustomSocket, roomId: string) {
  //   client.broadcast
  //     .to(roomId)
  //     .emit('users-changed', { user: client.user.nickname, event: 'left' })
  //   client.leave(roomId)
  // }

  // @SubscribeMessage('add-message')
  // async addMessage(client: CustomSocket, message: Message) {
  //   message.owner = client.user._id
  //   message.created = new Date()
  //   message = await this.messagesModel.create(message)
  //   message.owner = {
  //     _id: client.user._id,
  //     nickname: client.user.nickname
  //   } as User
  //   this.server.in(message.room as string).emit('message', message)
  // }
}
