import { JwtService } from '@nestjs/jwt'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { RedisClientType, createClient } from 'redis'
import { ServerOptions, Socket } from 'socket.io'
import { jwtConstants } from '../auth/constants'

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

const decodeToken = async (token: string) => {
  const jwtService = new JwtService({
    secret: jwtConstants.secret
  })

  try {
    return jwtService.verifyAsync(token)
  } catch (error) {
    console.log(error)
  }
}

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>
  private connectedUsers: Set<string> = new Set()
  private redisClient: RedisClientType

  async connectToRedis(): Promise<void> {
    this.redisClient = createClient({ url: `redis://localhost:6379` })
    const pubClient = this.redisClient.duplicate()
    const subClient = this.redisClient.duplicate()
    await Promise.all([
      this.redisClient.connect(),
      pubClient.connect(),
      subClient.connect()
    ])
    this.adapterConstructor = createAdapter(pubClient, subClient)
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options)

    server.on('connection', async (socket: CustomSocket) => {
      const token = socket.handshake.auth.token
      const user = await decodeToken(token)
      socket.user = user

      console.log('User connected:', user)
      this.connectedUsers.add(user)

      this.redisClient.set(`presence:${user.sub}`, 'online')

      socket.on('disconnect', () => {
        const time = Date.now().toString()
        console.log('User disconnected:', user.userName)
        this.connectedUsers.delete(user)

        const isUserConnected = Array.from(this.connectedUsers).some(
          connectedUser => connectedUser.sub === user.sub
        )

        if (!isUserConnected) {
          console.log(`User ${user.userName} is offline at ${time}.`)
          this.redisClient.set(`presence:${user.sub}`, time)
        }

        console.log('Connections:', this.connectedUsers.size)
      })

      console.log('Connections:', this.connectedUsers.size)
    })

    server.adapter(this.adapterConstructor)
    return server
  }
}
