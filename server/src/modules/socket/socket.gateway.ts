import { JwtService } from '@nestjs/jwt'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets'
import { MemberStatus } from '@prisma/client'
import { Server, Socket } from 'socket.io'
import { RedisService } from 'src/modules/redis/redis.service'
import { PrismaService } from '../prisma/prisma.service'
export type TJwtUser = {
  email: string
  userName: string
  sub: string
  iat: number
  exp: number
}


@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService
  ) {}

  async subscribeToWorkspaces({
    client,
    userId
  }: {
    userId: string
    client: Socket
  }) {
    const members = await this.prismaService.member.findMany({
      where: {
        userId: userId,

        workspace: {
          isAvailable: true
        }
      }
    })

    client.join([
      ...members
        .filter(e => e.status === MemberStatus.Active)
        .map(member => member.workspaceId),
      userId
    ])

    return members
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      if (!client?.handshake?.auth?.token) throw new Error('Missing token')

      const jwtUser = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        { secret: process.env.JWT_SECRET }
      )

      if (!jwtUser?.sub) throw new Error('Invalid user')

      const validUser = await this.prismaService.user.findUnique({
        where: {
          id: jwtUser.sub,
          isAvailable: true
        }
      })
      if (!validUser) throw new Error('Invalid user')

      client._id = validUser.id

      const members = await this.subscribeToWorkspaces({
        client,
        userId: validUser.id
      })

      this.redisService.redisClient.set(`presence:${validUser.id}`, 'online')
      this.server
        .to(members.map(member => member.workspaceId))
        .emit('userPresence', { [validUser.id]: 'online' })
    } catch (error) {
      client.disconnect()
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = client._id
      if (!userId) return

      const sockets = await this.server.fetchSockets()
      const userSockets = sockets.filter(socket => socket._id === userId)
      if (userSockets.length) return

      const now = Date.now().toString()
      const members = await this.prismaService.member.findMany({
        where: {
          userId
        }
      })

      this.server
        .to(members.map(member => member.workspaceId))
        .emit('userPresence', {
          [userId]: now
        })
      this.redisService.redisClient.set(`presence:${userId}`, now)
    } catch (error) {}
  }
}
