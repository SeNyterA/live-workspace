import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UsersService } from 'src/modules/users/users.service'
import { DirectMessage } from './direct-message.schema'

@Injectable()
export class DirectMessageService {
  constructor(
    @InjectModel(DirectMessage.name)
    private readonly directMessageModel: Model<DirectMessage>,
    private readonly usersService: UsersService
  ) {}

  async _checkExisting({
    targetId,
    userId
  }: {
    userId: string
    targetId: string
  }): Promise<DirectMessage> {
    const existingDirectMessage = await this.directMessageModel.findOne({
      userIds: { $all: [userId.toString(), targetId.toString()] },
      isAvailable: true
    })

    if (!existingDirectMessage) {
      throw new ForbiddenException('Your dont have permission')
    }

    return existingDirectMessage.toJSON()
  }

  async _getOrCreateDirectMessage({
    targetId,
    userId
  }: {
    userId: string
    targetId: string
  }): Promise<DirectMessage> {
    const userTarget = await this.usersService._findById(targetId)
    const existingDirectMessage = await this.directMessageModel.findOne({
      userIds: { $all: [userId, userTarget._id.toString()] },
      isAvailable: true
    })

    if (existingDirectMessage) {
      return existingDirectMessage.toJSON()
    }

    const newDirectMessage = await this.directMessageModel.create({
      userIds: [targetId, userId]
    })

    return newDirectMessage.toJSON()
  }

  async findAll(): Promise<DirectMessage[]> {
    return this.directMessageModel.find().exec()
  }

  async findById(id: string): Promise<DirectMessage> {
    const directMessage = await this.directMessageModel.findById(id).exec()
    if (!directMessage) {
      throw new NotFoundException('Direct message not found')
    }
    return directMessage
  }

  async update(
    id: string,
    updatedDirectMessage: Partial<DirectMessage>
  ): Promise<DirectMessage> {
    const directMessage = await this.directMessageModel
      .findByIdAndUpdate(id, updatedDirectMessage, { new: true })
      .exec()
    if (!directMessage) {
      throw new NotFoundException('Direct message not found')
    }
    return directMessage
  }

  async remove(id: string): Promise<DirectMessage> {
    const deletedDirectMessage = await this.directMessageModel
      .findByIdAndRemove(id)
      .exec()
    if (!deletedDirectMessage) {
      throw new NotFoundException('Direct message not found')
    }
    return deletedDirectMessage
  }

  async getDirectByUserId(userId: string) {
    const directs = await this.directMessageModel
      .find({
        userIds: { $in: [userId] },
        isAvailable: true
      })
      .lean()

    return directs
  }
}
