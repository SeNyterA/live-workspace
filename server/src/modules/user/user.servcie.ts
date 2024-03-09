import { Injectable } from '@nestjs/common'

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import * as crypto from 'crypto-js'
import { Server } from 'socket.io'
import { PrismaService } from '../prisma/prisma.service'

export const generateRandomHash = (
  inputString = Math.random().toString(),
  length = 8
): string => {
  const hash = crypto.SHA256(inputString).toString()
  const truncatedHash = hash.substring(0, length)
  return truncatedHash
}

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class UserService {
  @WebSocketServer()
  server: Server
  constructor(private readonly prismaService: PrismaService) {}

  async findByKeyword({
    keyword,
    skip,
    take
  }: {
    keyword: string
    skip: number
    take: number
  }) {
    const users = await this.prismaService.user.findMany({
      where: {
        OR: [
          { userName: { contains: keyword } },
          { email: { contains: keyword } },
          { nickName: { contains: keyword } }
        ]
      },
      skip,
      take,
      select: {
        password: false
      }
    })

    return {
      users
    }
  }
}
