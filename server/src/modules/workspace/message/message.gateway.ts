import { JwtService } from '@nestjs/jwt'
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
  user: TJwtUser
}

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SocketGateway {
  @WebSocketServer()
  server: Server
  constructor(
    private readonly jwtService: JwtService,
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
    @WsUser() user: TJwtUser,
    @MessageBody() { targetId }: { targetId: string }
  ) {
    this.toggleTyping({ targetId, userId: user.sub, isTyping: true })
    this.redisService.redisClient.set(
      `typing:${targetId}:${user.sub}`,
      '',
      'EX',
      3
    )
  }

  @SubscribeMessage('stopTyping')
  async stopTyping(
    @WsUser() user: TJwtUser,
    @MessageBody() { targetId }: { targetId: string }
  ) {
    this.toggleTyping({ targetId, userId: user.sub, isTyping: false })
    this.redisService.redisClient.del(`typing:${targetId}:${user.sub}`)
  }

  @SubscribeMessage('checkpointMessage')
  async checkpointMessage(
    @WsUser() user: TJwtUser,
    @MessageBody()
    { messageId, workspaceId }: { messageId: string; workspaceId: string }
  ) {
    const hashKey = `${user.sub}:${messageId}`
    const fieldValue = JSON.stringify({ workspaceId })
    await this.redisService.redisClient.hset('messageCheckpoint', hashKey, fieldValue)
  }
}
