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
}
