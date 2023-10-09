import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isEmpty } from 'lodash'
import { Model } from 'mongoose'
import { EMemberType } from '../../workspace.schema'
import { Team } from '../team.schema'
import { CreateChannelDto, UpdateChannelDto } from './channel.dto'
import { Channel } from './channel.schema'

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>
  ) {}

  async editMembers({
    id,
    userId,
    channelMembersPayload
  }: {
    id: string
    userId: string
    channelMembersPayload: CreateChannelDto[]
  }): Promise<boolean> {
    const channel = await this.channelModel.findById({
      _id: id,
      isAvailable: true,
      'members.userId': userId,
      'members.type': {
        $in: [EMemberType.Owner, EMemberType.Admin]
      }
    })

    if (!channel) {
      throw new ForbiddenException('Your dont have permission')
    }

    return true
  }

  //#region public service
  async getChannelsByUserId(userId: string): Promise<Channel[]> {
    const channels = await this.channelModel.find({
      'members.userId': userId,
      isAvailable: true
    })

    return channels.map(e => e.toJSON())
  }

  async getChannelById({
    id,
    userId
  }: {
    id: string
    userId: string
  }): Promise<Channel> {
    const channel = await this.channelModel.findOne({
      _id: id,
      isAvailable: true,
      'members.userId': userId
    })

    if (!channel) {
      throw new NotFoundException('Channel not found')
    }

    return channel.toJSON()
  }

  async create({
    channel,
    userId,
    teamId
  }: {
    channel: CreateChannelDto
    userId: string
    teamId: string
  }): Promise<Channel> {
    const team = await this.teamModel.findOne({
      _id: teamId,
      isAvailable: true,

      members: {
        $elemMatch: {
          userId: userId,
          type: { $in: [EMemberType.Owner, EMemberType.Admin] }
        }
      }
    })

    if (!team) {
      throw new ForbiddenException('Your dont have permission')
    }

    const createdChannel = new this.channelModel({
      ...channel,
      teamId,
      createdById: userId,
      modifiedById: userId,
      members: [
        {
          userId,
          type: EMemberType.Owner
        }
      ]
    })

    createdChannel.path = `${team.id.toString()}/${createdChannel._id.toString()}`
    createdChannel.save()

    return createdChannel
  }

  async update({
    id,
    channelPayload,
    userId
  }: {
    id: string
    channelPayload: UpdateChannelDto
    userId: string
  }) {
    if (isEmpty(channelPayload)) {
      throw new BadRequestException('Bad request')
    }

    const channel = await this.channelModel.findByIdAndUpdate(
      {
        _id: id,
        isAvailable: true,
        'members.userId': userId,
        'members.type': {
          $in: [EMemberType.Owner, EMemberType.Admin]
        }
      },
      {
        $set: {
          ...channelPayload,
          updatedAt: new Date(),
          modifiedById: userId
        }
      },
      { new: true }
    )

    if (!channel) {
      throw new ForbiddenException('Your dont have permission')
    }
    return channel.toJSON()
  }

  async delete({
    id,
    userId
  }: {
    id: string
    userId: string
  }): Promise<boolean> {
    const channel = await this.channelModel.findByIdAndUpdate(
      {
        _id: id,
        isAvailable: true,
        'members.userId': userId,
        'members.type': EMemberType.Owner
      },
      {
        $set: {
          isAvailable: false,
          updatedAt: new Date(),
          modifiedById: userId
        }
      },
      { new: true }
    )

    if (!channel) {
      throw new ForbiddenException('Your dont have permission')
    }
    return true
  }
  //#endregion
}
