import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { WsUser } from 'src/decorators/users.decorator'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { RedisService } from 'src/modules/redis/redis.service'
export type TJwtUser = {
  email: string
  userName: string
  sub: string
  iat: number
  exp: number
}
export interface CustomSocket extends Socket {
  userId: string
}

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class MessageGateway {
  @WebSocketServer()
  server: Server
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService
  ) {
    this.listenDeleteKey()
  }

  async listenDeleteKey() {
    this.redisService.subRedis.on(
      'pmessage',
      async (pattern, channel, message) => {
        console.log(pattern, channel, message)
        const [prefix] = message.split(':')
        if (prefix === 'typing') {
          const [, targetId, userId] = message.split(':')
          this.toggleTyping({ targetId, userId, isTyping: false })
        }
        if (prefix === 'presence') {
          const userId = message.split(':')[1]
          this.server.emit('userPresence', { [userId]: Date.now().toString() })
        }
      }
    )

    this.redisService.subRedis.psubscribe('__keyevent@0__:expired')
  }

  async toggleTyping({
    targetId,
    isTyping,
    userId
  }: {
    targetId: string
    userId: string
    isTyping: boolean
  }) {
    this.server.to([targetId]).emit('typing', {
      userId,
      targetId,
      isTyping
    })
  }

  @SubscribeMessage('startTyping')
  async startTyping(
    @WsUser() userId: string,
    @MessageBody() { targetId }: { targetId: string }
  ) {
    this.toggleTyping({ targetId, userId: userId, isTyping: true })
    this.redisService.redisClient.set(
      `typing:${targetId}:${userId}`,
      '',
      'EX',
      3
    )
  }

  @SubscribeMessage('stopTyping')
  async stopTyping(
    @WsUser() userId: string,
    @MessageBody() { targetId }: { targetId: string }
  ) {
    this.toggleTyping({ targetId, userId: userId, isTyping: false })
    this.redisService.redisClient.del(`typing:${targetId}:${userId}`)
  }

  @SubscribeMessage('readedMessage')
  async readedMessage(
    @WsUser() userId: string,
    @MessageBody()
    { messageId, workspaceId }: { messageId: string; workspaceId: string }
  ) {
    // this.redisService.redisClient.hset(
    //   `messageCheckpoint:${workspaceId}`,
    //   userId,
    //   messageId
    // )
    this.redisService.redisClient.hset(`unread:${userId}`, workspaceId, 0)

    // this.server.to([workspaceId]).emit('checkpointMessage', {
    //   userId: userId,
    //   messageId,
    //   workspaceId
    // })
    this.server.to([userId]).emit('unread', {
      workspaceId,
      count: 0
    })
  }
}
