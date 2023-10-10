import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DirectMessageService } from '../direct-message/direct-message.service'
import { GroupService } from '../group/group.service'
import { ChannelService } from '../team/channel/channel.service'
import { EMessageFor, EMessageType, Message } from './message.schema'

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
    private readonly directMessageService: DirectMessageService,
    private readonly channelService: ChannelService,
    private readonly groupService: GroupService
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

    return newMess.toJSON()
  }

  async _createForChannel({
    channelId,
    userId,
    messagePayload
  }: {
    userId: string
    channelId: string
    messagePayload: any
  }) {
    await this.channelService._checkExisting({
      id: channelId,
      userId
    })

    const newMess = await this.messageModel.create({
      messageReferenceId: channelId,
      createdById: userId,
      modifiedById: userId,
      content: 'content',
      messageFor: EMessageFor.Channel,
      messageType: EMessageType.Normal
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
    await this.groupService._checkExisting({
      id: groupId,
      userId
    })

    const newMess = await this.messageModel.create({
      messageReferenceId: groupId,
      createdById: userId,
      modifiedById: userId,
      content: 'content',
      messageFor: EMessageFor.Group,
      messageType: EMessageType.Normal
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
      case EMessageFor.Channel: {
        await this.channelService._checkExisting({
          id: message.messageReferenceId,
          userId
        })
        break
      }
      case EMessageFor.Group: {
        await this.groupService._checkExisting({
          id: message.messageReferenceId,
          userId
        })
        break
      }
      case EMessageFor.Direct: {
        break
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
      case EMessageFor.Channel: {
        await this.channelService._checkExisting({
          id: messageReferenceId,
          userId
        })

        break
      }
      case EMessageFor.Group: {
        await this.groupService._checkExisting({
          id: messageReferenceId,
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
}
