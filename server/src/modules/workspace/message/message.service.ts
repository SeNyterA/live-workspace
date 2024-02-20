import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JSONContent } from 'src/libs/helper'
import { DirectMessageService } from '../direct-message/direct-message.service'
import { MemberService } from '../member/member.service'
import { WorkspaceService } from './../workspace.service'
import { EMessageFor, EMessageType, Message } from './message.schema'

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    readonly messageModel: Model<Message>,
    private readonly directMessageService: DirectMessageService,
    private readonly memberService: MemberService,
    private readonly workspaceService: WorkspaceService
  ) {}

  async _makeUnreadCount(targetId: string, mentionIds?: string[]) {
    const members = await this.memberService.memberModel
      .find({
        targetId,
        isAvailable: true
      })
      .lean()

    await members.map(member => {
      this.workspaceService._incrementUnread(
        member.userId.toString(),
        member.targetId.toString()
      )
    })
  }

  async _createForDirect({
    targetId,
    userId,
    messagePayload
  }: {
    userId: string
    targetId: string
    messagePayload: { content: string }
  }) {
    const { direct: directMessage, isNew } =
      await this.directMessageService._getOrCreateDirectMessage({
        targetId,
        userId
      })

    const newMess = await this.messageModel.create({
      messageReferenceId: directMessage._id.toString(),
      createdById: userId,
      modifiedById: userId,
      content: messagePayload.content,
      messageFor: EMessageFor.Direct,
      messageType: EMessageType.Normal
    })

    if (isNew) {
      this.workspaceService.workspaces({
        rooms: [
          ...directMessage.userIds.map(e => e.toString()),
          directMessage._id.toString()
        ],
        workspaces: [{ action: 'create', type: 'direct', data: directMessage }]
      })
    }

    this.workspaceService.message({
      rooms: [targetId, userId, directMessage._id.toString()],
      data: {
        action: 'create',
        message: newMess
      }
    })
    directMessage.userIds.map(userId =>
      this.workspaceService._incrementUnread(
        userId.toString(),
        directMessage._id.toString()
      )
    )

    return newMess.toJSON()
  }

  async _createForChannel({
    channelId,
    userId,
    messagePayload
  }: {
    userId: string
    channelId: string
    messagePayload: { content: JSONContent; attachments?: string[] }
  }) {
    await this.memberService._checkExisting({
      userId,
      targetId: channelId
    })

    const newMess = await this.messageModel.create({
      messageReferenceId: channelId,
      createdById: userId,
      modifiedById: userId,
      messageFor: EMessageFor.Channel,
      messageType: EMessageType.Normal,
      ...messagePayload
    })

    this.workspaceService.message({
      rooms: [channelId],
      data: {
        action: 'create',
        message: newMess
      }
    })
    this._makeUnreadCount(channelId)

    return newMess.toJSON()
  }

  async _createForGroup({
    groupId,
    userId,
    messagePayload
  }: {
    userId: string
    groupId: string
    messagePayload: { content: string }
  }) {
    await this.memberService._checkExisting({
      userId,
      targetId: groupId
    })

    const newMess = await this.messageModel.create({
      messageReferenceId: groupId,
      createdById: userId,
      modifiedById: userId,
      content: messagePayload.content,
      messageFor: EMessageFor.Group,
      messageType: EMessageType.Normal
    })

    this.workspaceService.message({
      rooms: [groupId],
      data: {
        action: 'create',
        message: newMess
      }
    })

    this._makeUnreadCount(groupId)
    return newMess.toJSON()
  }

  async _createForCard({
    targetId,
    userId,
    messagePayload,
    boardId
  }: {
    userId: string
    targetId: string
    messagePayload: { content: string }
    boardId: string
  }) {
    await this.memberService._checkExisting({
      userId,
      targetId: boardId
    })

    const newMess = await this.messageModel.create({
      messageReferenceId: boardId,
      createdById: userId,
      modifiedById: userId,
      content: messagePayload.content,
      messageFor: EMessageFor.Card,
      messageType: EMessageType.Normal,
      replyRootId: targetId
    })

    this.workspaceService.message({
      rooms: [boardId],
      data: {
        action: 'create',
        message: newMess
      }
    })

    this._makeUnreadCount(targetId)
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
    messgaeFor,
    pageSize = 100,
    fromId
  }: {
    userId: string
    messageReferenceId: string
    messgaeFor: EMessageFor
    fromId?: string
    pageSize?: number
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
        isAvailable: true,
        ...(fromId && { _id: { $lt: fromId } })
      })
      .sort({ createdAt: -1 })
      .limit(pageSize)

    const remainingCount = await this.messageModel
      .find({
        messageReferenceId: _messageReferenceId,
        isAvailable: true,
        ...(fromId && { _id: { $lt: fromId } })
      })
      .countDocuments()

    return {
      messages,
      remainingCount: remainingCount - messages.length
    }
  }

  async reaction({
    payload: { icon },
    messageId,
    userId
  }: {
    userId: string
    messageId: string
    payload: { icon: string }
  }) {
    const message = await this.messageModel.findOne({
      _id: messageId,
      isAvailable: true
    })

    if (!message) {
      return {
        error: {
          code: 1000,
          message: 'message not found'
        }
      }
    }

    const existingMember = await this.memberService._checkExisting({
      targetId: message.messageReferenceId.toString(),
      userId
    })

    if (!existingMember) {
      return {
        error: {
          code: 1000,
          message: 'user not permission'
        }
      }
    }

    if (message.reactions[userId] === icon) {
      delete message.reactions[userId]
    } else {
      message.reactions[userId] = icon
    }

    await message.save()

    this.workspaceService.message({
      rooms: [message.messageReferenceId.toString()],
      data: {
        action: 'rection',
        message: message
      }
    })

    return { data: message.toJSON() }
  }
}
