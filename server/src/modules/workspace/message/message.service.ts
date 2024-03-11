import { ForbiddenException, Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { MemberRole, MemberStatus, Message, MessageType } from '@prisma/client'
import { Server } from 'socket.io'
import { Errors } from 'src/libs/errors'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { RedisService } from 'src/modules/redis/redis.service'
import { TJwtUser } from 'src/modules/socket/socket.gateway'

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
    private readonly redisService: RedisService,
    private readonly prismService: PrismaService
  ) {}

  async emitMessage({ message }: { message: Message }) {
    this.server.to([message.workspaceId]).emit('message', { message })
  }

  async createMessage({
    user,
    targetId,
    message
  }: {
    message: Message
    user: TJwtUser
    targetId: string
  }) {
    const memberOperator = await this.prismService.member.findFirst({
      where: {
        userId: user.sub,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const newMessage = await this.prismService.message.create({
      data: {
        ...message,
        attachments: {
          createMany: {
            data: (message as any).attachments
          }
        },
        type: MessageType.Normal,
        workspaceId: targetId,
        createdById: user.sub,
        modifiedById: user.sub
      },
      include: {
        attachments: true
      }
    })

    this.server.to([targetId]).emit('message', { message: newMessage })

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
    const memberOperator = await this.prismService.member.findFirst({
      where: {
        userId: user.sub,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const totalMessages = await this.prismService.message.count({
      where: {
        workspaceId: targetId,
        isAvailable: true
      }
    })

    const messages = await this.prismService.message.findMany({
      where: {
        workspaceId: targetId,
        isAvailable: true,
        id: fromId ? { lt: fromId } : undefined
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: size,
      include: {
        attachments: true
      }
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
    const memberOperator = await this.prismService.member.findFirst({
      where: {
        userId: user.sub,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }
    const message = await this.prismService.message.findFirst({
      where: {
        id: messageId,
        workspace: { id: targetId }
      }
    })
    message.isPinned = !message.isPinned
    message.modifiedById = user.sub
    const newMessage = await this.prismService.message.update({
      where: { id: message.id },
      data: message
    })
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
    const memberOperator = await this.prismService.member.findFirst({
      where: {
        userId: user.sub,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }
    return this.prismService.message.findMany({
      where: {
        workspaceId: targetId,
        isPinned: true,
        isAvailable: true
      }
    })
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
    const message = await this.prismService.message.findFirst({
      where: {
        id: messageId,
        createdById: user.sub,
        workspaceId: targetId,
        isAvailable: true
      }
    })

    if (!message) {
      const isAdminOrOwner = await this.prismService.member.findFirst({
        where: {
          userId: user.sub,
          status: MemberStatus.Active,
          workspaceId: targetId,
          role: MemberRole.Admin
        }
      })

      if (!isAdminOrOwner) {
        throw new ForbiddenException(Errors.PERMISSION_DENIED)
      }
    }

    message.isAvailable = false
    message.modifiedById = user.sub

    const messageUpdated = await this.prismService.message.update({
      where: { id: message.id },
      data: message
    })
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
