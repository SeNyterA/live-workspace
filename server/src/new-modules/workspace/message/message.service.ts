import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EMemberType, Member } from 'src/entities/member.entity'
import { Message } from 'src/entities/message.entity'
import { User } from 'src/entities/user.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { RedisService } from 'src/modules/redis/redis.service'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { In, LessThan, Repository } from 'typeorm'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class MessageService {
  @WebSocketServer()
  server: Server

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly redisService: RedisService
  ) {}

  async emitMessage({ message }: { message: Message }) {
    this.server.to([message.target._id]).emit('message', { message })
  }

  async createMessage({
    user,
    targetId,
    message,
    replyToId,
    threadId
  }: {
    message: Message
    user: TJwtUser
    targetId: string
    replyToId?: string
    threadId?: string
  }) {
    this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: targetId },
        type: In([
          EMemberType.Channel,
          EMemberType.DirectMessage,
          EMemberType.Group
        ])
      }
    })

    const newMessage = await this.messageRepository.save(
      this.messageRepository.create({
        ...message,
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        target: { _id: targetId },
        replyTo: replyToId ? { _id: replyToId } : undefined,
        thread: threadId ? { _id: threadId } : undefined
      })
    )

    this.emitMessage({ message: newMessage })

    return newMessage
  }

  async getMessages({
    targetId,
    size,
    fromId,
    user
  }: {
    targetId: string
    fromId?: string
    size?: number
    user: TJwtUser
  }) {
    this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: targetId },
        type: In([
          EMemberType.Channel,
          EMemberType.DirectMessage,
          EMemberType.Group
        ])
      }
    })

    const totalMessages = await this.messageRepository.count({
      where: {
        target: { _id: targetId },
        isAvailable: true
      }
    })

    const messages = await this.messageRepository.find({
      where: {
        target: { _id: targetId },
        isAvailable: true,
        _id: fromId ? LessThan(fromId) : undefined
      },
      order: {
        createdAt: 'DESC'
      },
      take: Number(size)
    })

    const remainingCount = totalMessages - messages.length

    return { messages, remainingCount }
  }

  async pinMessage({
    user,
    messageId,
    targetId
  }: {
    user: TJwtUser
    messageId: string
    targetId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: targetId }
      }
    })
    const message = await this.messageRepository.findOneOrFail({
      where: {
        _id: messageId,
        target: { _id: targetId }
      }
    })
    message.isPinned = !message.isPinned
    return this.messageRepository.save(message)
  }

  async reactionMessage({
    messageId,
    reaction,
    targetId,
    user
  }: {
    user: TJwtUser
    messageId: string
    targetId: string
    reaction: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: targetId }
      }
    })

    const message = await this.messageRepository.findOneOrFail({
      where: {
        _id: messageId,
        target: { _id: targetId }
      }
    })
    message.reactions = message.reactions || {}

    if (message.reactions[user.sub] === reaction) {
      delete message.reactions[user.sub]
    } else {
      message.reactions[user.sub] = reaction
    }

    return this.messageRepository.save(message)
  }

  //#region Typing
  async startTyping(userId: string, targetId: string) {
    await this.toggleTyping({ targetId, userId, type: 1 })
    await this.redisService.redisClient.set(
      `typing:${targetId}:${userId}`,
      '',
      'EX',
      3
    )
  }

  async stopTyping(userId: string, targetId: string) {
    await this.redisService.redisClient.del(`typing:${targetId}:${userId}`)
    this.toggleTyping({ targetId, userId, type: 0 })
  }

  async toggleTyping({
    targetId,
    type,
    userId
  }: {
    targetId: string
    userId: string
    type: 0 | 1
  }) {
    this.server.to([targetId]).emit('typing', {
      userId,
      targetId,
      type
    })
  }
  //#endregion
}
