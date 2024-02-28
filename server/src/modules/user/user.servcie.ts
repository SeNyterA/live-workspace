import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import * as crypto from 'crypto-js'
import { Server } from 'socket.io'
import { User } from 'src/entities/user.entity'
import { Like, Repository } from 'typeorm'

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
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByKeyword({
    keyword,
    skip,
    take
  }: {
    keyword: string
    skip: number
    take: number
  }) {
    const users = await this.userRepository.find({
      where: [
        { isAvailable: true, userName: Like(`%${keyword}%`) },
        { isAvailable: true, email: Like(`%${keyword}%`) },
        { isAvailable: true, nickName: Like(`%${keyword}%`) }
      ],
      skip,
      take
    })

    return { users }
  }
}
