import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { DirectMessage } from '../schemas/direct-message.schema'

@Injectable()
export class DirectMessageService {
  constructor(
    @InjectModel(DirectMessage.name)
    private readonly directMessageModel: Model<DirectMessage>
  ) {}

  async create(directMessage: DirectMessage): Promise<DirectMessage> {
    const createdDirectMessage = new this.directMessageModel(directMessage)
    return createdDirectMessage.save()
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
}
