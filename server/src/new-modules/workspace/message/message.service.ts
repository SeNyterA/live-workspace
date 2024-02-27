import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import { EMesssageFor, Message } from 'src/entities/message.entity'
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
    this.server.to([message.targetId]).emit('message', { message })
  }

  async createMessage({
    user,
    targetId,
    message,
    replyToId,
    threadId,
    type = EMesssageFor.Channel
  }: {
    message: Message
    user: TJwtUser
    targetId: string
    replyToId?: string
    threadId?: string
    type?: EMesssageFor
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: targetId, isAvailable: true },
        isAvailable: true,
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
      }),
      { reload: true }
    )

    const messageInserted = await this.messageRepository.findOneOrFail({
      where: { _id: newMessage._id },
      relations: ['attachments']
    })

    this.emitMessage({ message: messageInserted })

    return messageInserted
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
    await this.memberRepository.findOneOrFail({
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
      take: Number(size),
      relations: ['attachments']
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
        workspace: { _id: targetId, isAvailable: true },
        isAvailable: true,
        type: In([
          EMemberType.Channel,
          EMemberType.DirectMessage,
          EMemberType.Group
        ])
      }
    })
    const message = await this.messageRepository.findOneOrFail({
      where: {
        _id: messageId,
        target: { _id: targetId }
      }
    })
    message.isPinned = !message.isPinned
    message.modifiedBy = { _id: user.sub } as any
    const newMessage = await this.messageRepository.save(message)
    this.emitMessage({ message: newMessage })
    return newMessage
  }

  async getPinedMessages({
    targetId,
    user
  }: {
    user: TJwtUser
    targetId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: targetId, isAvailable: true },
        isAvailable: true,
        type: In([
          EMemberType.Channel,
          EMemberType.DirectMessage,
          EMemberType.Group
        ])
      }
    })

    return this.messageRepository.find({
      where: {
        target: { _id: targetId, isAvailable: true },
        isPinned: true,
        isAvailable: true
      }
    })
  }

  async reactMessage({
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
        workspace: { _id: targetId, isAvailable: true },
        isAvailable: true,
        type: In([
          EMemberType.Channel,
          EMemberType.DirectMessage,
          EMemberType.Group
        ])
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

  async deleteMessage({
    messageId,
    user,
    targetId
  }: {
    messageId: string
    user: TJwtUser
    targetId: string
  }) {
    const message = await this.messageRepository.findOneOrFail({
      where: [
        {
          _id: messageId,
          createdBy: { _id: user.sub },
          target: {
            _id: targetId,
            members: {
              _id: user.sub,
              isAvailable: true
            }
          }
        },
        {
          _id: messageId,
          target: {
            _id: targetId,
            members: {
              _id: user.sub,
              isAvailable: true,
              role: In([EMemberRole.Admin, EMemberRole.Owner])
            }
          }
        }
      ]
    })

    message.isAvailable = false
    message.modifiedBy._id = user.sub

    const messageUpdated = await this.messageRepository.save(message)
    this.emitMessage({ message: messageUpdated })
    return messageUpdated
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
