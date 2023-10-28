import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DirectMessageService } from '../direct-message/direct-message.service'
import { MemberService } from '../member/member.service'
import { WorkspaceService } from './../workspace.service'
import { EMessageFor, EMessageType, Message } from './message.schema'

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    private readonly directMessageService: DirectMessageService,
    private readonly memberService: MemberService,
    private readonly workspaceService: WorkspaceService
  ) {}

  async _createForDirect({
    targetId,
    userId,
    messagePayload
  }: {
    userId: string
    targetId: string
    messagePayload: any
  }) {
    const directMessage =
      await this.directMessageService._getOrCreateDirectMessage({
        targetId,
        userId
      })

    const newMess = await this.messageModel.create({
      messageReferenceId: directMessage._id.toString(),
      createdById: userId,
      modifiedById: userId,
      content: 'content',
      messageFor: EMessageFor.Direct,
      messageType: EMessageType.Normal
    })

    this.workspaceService.message({
      rooms: [`user:${targetId}`, `user:${userId}`],
      data: {
        action: 'create',
        message: newMess
      }
    })

    return newMess.toJSON()
  }

  async _createForChannel({
    channelId,
    userId,
    messagePayload
  }: {
    userId: string
    channelId: string
    messagePayload: { content: string }
  }) {
    await this.memberService._checkExisting({
      userId,
      targetId: channelId
    })

    const newMess = await this.messageModel.create({
      messageReferenceId: channelId,
      createdById: userId,
      modifiedById: userId,
      content: messagePayload.content,
      messageFor: EMessageFor.Channel,
      messageType: EMessageType.Normal
    })

    this.workspaceService.message({
      rooms: [`channel:${channelId}`],
      data: {
        action: 'create',
        message: newMess
      }
    })

    return newMess.toJSON()
  }

  async _createForGroup({
    groupId,
    userId,
    messagePayload
  }: {
    userId: string
    groupId: string
    messagePayload: any
  }) {
    await this.memberService._checkExisting({
      userId,
      targetId: groupId
    })

    const newMess = await this.messageModel.create({
      messageReferenceId: groupId,
      createdById: userId,
      modifiedById: userId,
      content: 'content',
      messageFor: EMessageFor.Group,
      messageType: EMessageType.Normal
    })

    this.workspaceService.message({
      rooms: [`group:${groupId}`],
      data: {
        action: 'create',
        message: newMess
      }
    })

    return newMess.toJSON()
  }

  async _editMessage({
    messageId,
    userId
  }: {
    userId: string
    messageId: string
  }) {
    const message = await this.messageModel.findOne({
      _id: messageId,
      createdById: userId,
      isAvailable: true
    })

    if (!message) {
      throw new NotFoundException('Message not found')
    }

    if (message.messageType === EMessageType.System) {
      throw new ForbiddenException('Cannot edit system message')
    }

    switch (message.messageFor) {
      case EMessageFor.Direct: {
        break
      }
      default: {
        this.memberService._checkExisting({
          userId,
          targetId: message._id.toString()
        })
      }
    }

    return 'editmess'
  }

  async _getMessages({
    messageReferenceId,
    userId,
    messgaeFor
  }: {
    userId: string
    messageReferenceId: string
    messgaeFor: EMessageFor
  }) {
    let _messageReferenceId = messageReferenceId
    switch (messgaeFor) {
      case EMessageFor.Channel:
      case EMessageFor.Group: {
        await this.memberService._checkExisting({
          targetId: messageReferenceId,
          userId
        })

        break
      }
      case EMessageFor.Direct: {
        const directMess = await this.directMessageService._checkExisting({
          targetId: messageReferenceId,
          userId
        })

        _messageReferenceId = directMess._id.toString()
        break
      }
    }

    const messages = await this.messageModel
      .find({
        messageReferenceId: _messageReferenceId,
        isAvailable: true
      })
      .lean()

    return {
      messages,
      total: messages.length
    }
  }

  async _createSystemMessage({
    targetId,
    userId,
    messagePayload,
    messageFor
  }: {
    userId: string
    targetId: string
    messagePayload: string
    messageFor: EMessageFor
  }) {
    const newMess = await this.messageModel.create({
      messageReferenceId: targetId,
      createdById: userId,
      modifiedById: userId,
      content: messagePayload,
      messageFor: messageFor,
      messageType: EMessageType.System
    })

    this.workspaceService.message({
      rooms: [targetId, `user:${userId}`],
      data: {
        action: 'create',
        message: newMess
      }
    })

    return newMess.toJSON()
  }
}
