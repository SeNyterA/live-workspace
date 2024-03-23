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
export interface CustomSocket extends Socket {
  user: TJwtUser
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
    user
  }: {
    user: TJwtUser
    client: CustomSocket
  }) {
    const members = await this.prismaService.member.findMany({
      where: {
        userId: user.sub,

        workspace: {
          isAvailable: true
        }
      }
    })

    client.join([
      ...members
        .filter(e => e.status === MemberStatus.Active)
        .map(member => member.workspaceId),
      user.sub
    ])

    return members
  }

  async handleConnection(client: CustomSocket, ...args: any[]) {
    try {
      if (!client?.handshake?.auth?.token) throw new Error('Missing token')

      const jwtUser = await this.jwtService.verifyAsync(
        client.handshake.auth.token,
        { secret: process.env.JWT_SECRET }
      )

      if (!jwtUser?.sub) throw new Error('Invalid user')
      client.user = jwtUser

      const members = await this.subscribeToWorkspaces({
        client,
        user: jwtUser
      })

      this.redisService.redisClient.set(`presence:${jwtUser.sub}`, 'online')
      this.server
        .to(members.map(member => member.workspaceId))
        .emit('userPresence', { [jwtUser.sub]: 'online' })
    } catch (error) {
      client.disconnect()
    }
  }

  async handleDisconnect(client: CustomSocket) {
    try {
      const userId = client?.user?.sub
      if (!userId) return

      const sockets = await this.server.fetchSockets()
      const userSockets = sockets.filter(socket => socket.rooms.has(userId))
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
