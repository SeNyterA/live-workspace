import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Channel } from './channel.schema'

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private readonly channelModel: Model<Channel>
  ) {}

  async create(channel: Channel): Promise<Channel> {
    const createdChannel = new this.channelModel(channel)
    return createdChannel.save()
  }

  async findAll(): Promise<Channel[]> {
    return this.channelModel.find().exec()
  }

  async findById(id: string): Promise<Channel> {
    const channel = await this.channelModel.findById(id).exec()
    if (!channel) {
      throw new NotFoundException('Channel not found')
    }
    return channel
  }

  async update(id: string, updatedChannel: Partial<Channel>): Promise<Channel> {
    const channel = await this.channelModel
      .findByIdAndUpdate(id, updatedChannel, { new: true })
      .exec()
    if (!channel) {
      throw new NotFoundException('Channel not found')
    }
    return channel
  }

  async remove(id: string): Promise<Channel> {
    const deletedChannel = await this.channelModel.findByIdAndRemove(id).exec()
    if (!deletedChannel) {
      throw new NotFoundException('Channel not found')
    }
    return deletedChannel
  }
}
