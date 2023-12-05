import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { UsersService } from 'src/modules/users/users.service'
import { DirectMessage } from './direct-message.schema'

@Injectable()
export class DirectMessageService {
  constructor(
    @InjectModel(DirectMessage.name)
    public readonly directMessageModel: Model<DirectMessage>,
    public readonly usersService: UsersService
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
      // userIds: { $in: [userId.toString()] },
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
  }) {
    const userTarget = await this.usersService._findById(targetId)
    const existingDirectMessage = await this.directMessageModel.findOne({
      userIds: { $all: [userId, userTarget._id.toString()] },
      isAvailable: true
    })

    if (existingDirectMessage) {
      return {
        direct: existingDirectMessage.toJSON(),
        isNew: false
      }
    }

    const newDirectMessage = await this.directMessageModel.create({
      userIds: [targetId, userId]
    })

    return {
      direct: newDirectMessage.toJSON(),
      isNew: true
    }
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
      .findByIdAndRemove(id, { lean: true })
      .exec()
    if (!deletedDirectMessage) {
      throw new NotFoundException('Direct message not found')
    }
    return deletedDirectMessage
  }

  async getDirectsByUserId(userId: string) {
    const directs = await this.directMessageModel
      .find({
        userIds: { $in: [userId] },
        isAvailable: true
      })
      .lean()

    const directUserId = directs.reduce((pre, next) => {
      return [...pre, ...next.userIds.map(e => e.toString())]
    }, [] as string[])

    return { directs, directUserId }
  }

  async getDirectMessInfo({
    userId,
    directId,
    targetEmail,
    targetId,
    targetUserName
  }: {
    userId: string
    directId?: string
    targetUserName?: string
    targetEmail?: string
    targetId?: string
  }) {
    try {
      let _targetId: string
      if (targetId) {
        _targetId = targetId
      } else if (targetEmail || targetUserName) {
        const target = await this.usersService.userModel.findOne({
          isAvailable: true,
          $or: [
            {
              userName: targetUserName
            },
            { email: targetEmail }
          ]
        })
        if (target._id.toString() !== userId) _targetId = target._id.toString()
      }

      const filterQueries: FilterQuery<DirectMessage>[] = []
      if (userId && _targetId) {
        filterQueries.push({
          userIds: { $all: [userId, _targetId] }
        })
      }
      if (directId && userId) {
        filterQueries.push({
          _id: directId || '',
          userIds: { $in: [userId] }
        })
      }

      const direct = await this.directMessageModel.findOne({
        isAvailable: true,
        $or: filterQueries
      })
      if (!direct) {
        throw new NotFoundException()
      }

      const users = await this.usersService.userModel
        .find({
          _id: { $in: direct.userIds }
        })
        .lean()

      return {
        direct,
        users
      }
    } catch (error) {
      throw new NotFoundException()
    }
  }
}
