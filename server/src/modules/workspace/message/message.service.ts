import { ForbiddenException, Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import {
  MemberRole,
  MemberStatus,
  Message,
  MessageType,
  Reaction
} from '@prisma/client'
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
    private readonly prismaService: PrismaService
  ) {}

  async emitMessage({ message }: { message: Message }) {
    this.server.to([message.workspaceId]).emit('message', { message })
  }

  async incrUnreadMsgs({ message }: { message: Message }) {
    const members = await this.prismaService.member.findMany({
      where: {
        workspaceId: message.workspaceId,
        status: MemberStatus.Active
      }
    })

    members.forEach(async member => {
      {
        if (member.userId === message.createdById) return

        const count = await this.redisService.redisClient.hincrby(
          `unread:${member.userId}`,
          message.workspaceId,
          1
        )
        this.server.to([member.userId]).emit('unread', {
          workspaceId: message.workspaceId,
          count
        })
      }
    })
  }

  async createMessage({
    userId,
    targetId,
    message
  }: {
    message: Message
    userId: string
    targetId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const newMessage = await this.prismaService.message.create({
      data: {
        ...message,
        attachments: {
          createMany: {
            data: (message as any).attachments
          }
        },
        type: MessageType.Normal,
        workspaceId: targetId,
        createdById: userId,
        modifiedById: userId
      },
      include: {
        attachments: {
          include: {
            file: true
          }
        }
      }
    })

    this.server.to([targetId]).emit('message', { message: newMessage })
    this.incrUnreadMsgs({ message: newMessage })

    return newMessage
  }

  async getMessages({
    targetId,
    size,
    fromId,
    userId
  }: {
    targetId: string
    fromId?: string
    size?: number
    userId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    if (!!fromId) {
      const firstMess = await this.prismaService.message.findUnique({
        where: { id: fromId, isAvailable: true }
      })

      const messages = await this.prismaService.message.findMany({
        where: {
          workspaceId: targetId,
          isAvailable: true,
          createdAt: { lte: firstMess?.createdAt }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: size + 1,
        include: {
          attachments: {
            include: {
              file: true
            }
          },
          reactions: {
            where: {
              isAvailable: true
            }
          },
          replyTo: true,
          theadMessages: true
        }
      })
      return {
        messages: messages.slice(0, size),
        isComplete: messages.length <= size
      }
    } else {
      const messages = await this.prismaService.message.findMany({
        where: {
          workspaceId: targetId,
          isAvailable: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: size + 1,
        include: {
          attachments: {
            include: {
              file: true
            }
          },
          reactions: {
            where: {
              isAvailable: true
            }
          }
        }
      })

      return {
        messages: messages.slice(0, size),
        isComplete: messages.length <= size
      }
    }
  }

  async pinMessage({
    userId,
    messageId,
    targetId
  }: {
    userId: string
    messageId: string
    targetId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }
    const message = await this.prismaService.message.findFirst({
      where: {
        id: messageId,
        workspace: { id: targetId }
      }
    })
    message.isPinned = !message.isPinned
    message.modifiedById = userId
    const newMessage = await this.prismaService.message.update({
      where: { id: message.id },
      data: message
    })
    this.emitMessage({ message: newMessage })
    return newMessage
  }

  async getPinedMessages({
    targetId,
    userId
  }: {
    userId: string
    targetId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }
    return this.prismaService.message.findMany({
      where: {
        workspaceId: targetId,
        isPinned: true,
        isAvailable: true
      }
    })
  }

  async deleteMessage({
    messageId,
    userId,
    targetId
  }: {
    messageId: string
    userId: string
    targetId: string
  }) {
    const message = await this.prismaService.message.findFirst({
      where: {
        id: messageId,
        createdById: userId,
        workspaceId: targetId,
        isAvailable: true
      }
    })

    if (!message) {
      const isAdminOrOwner = await this.prismaService.member.findFirst({
        where: {
          userId: userId,
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
    message.modifiedById = userId

    const messageUpdated = await this.prismaService.message.update({
      where: { id: message.id },
      data: message
    })
    this.emitMessage({ message: messageUpdated })
    return messageUpdated
  }

  async reactMessage({
    messageId,
    targetId,
    userId,
    icon
  }: {
    messageId: string
    targetId: string
    userId: string
    icon: { native?: string; shortcode?: string; unified: string }
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
        status: MemberStatus.Active,
        workspaceId: targetId
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const reaction = await this.prismaService.reaction.findUnique({
      where: { userId_messageId: { messageId, userId: userId } }
    })

    let newReaction: Reaction
    if (reaction) {
      if (reaction.unified === icon.unified) {
        newReaction = await this.prismaService.reaction.update({
          where: { userId_messageId: { messageId, userId: userId } },
          data: { isAvailable: false }
        })
      } else {
        newReaction = await this.prismaService.reaction.update({
          where: { userId_messageId: { messageId, userId: userId } },
          data: { isAvailable: true, ...icon }
        })
      }
    } else {
      newReaction = await this.prismaService.reaction.create({
        data: {
          userId: userId,
          messageId,
          ...icon
        }
      })
    }

    this.server.to([targetId]).emit('reaction', {
      reaction: newReaction
    })

    return { reaction: newReaction }
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
