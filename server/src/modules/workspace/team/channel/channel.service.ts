import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isEmpty } from 'lodash'
import { Model } from 'mongoose'
import { EMemberRole, Member } from '../../member/member.schema'
import { MemberService } from '../../member/member.service'
import { MessageService } from '../../message/message.service'
import { Team } from '../team.schema'
import { TeamService } from '../team.service'
import { CreateChannelDto, UpdateChannelDto } from './channel.dto'
import { Channel } from './channel.schema'
import { EMessageFor } from '../../message/message.schema'

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private readonly channelModel: Model<Channel>,
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    private readonly memberService: MemberService,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
    private readonly teamService: TeamService
  ) {}

  async _checkExisting({ channelId }: { channelId: string }): Promise<boolean> {
    const existingChannel = await this.channelModel.findOne({
      _id: channelId,
      isAvailable: true
    })
    if (!existingChannel) {
      throw new ForbiddenException('Your dont have permission')
    }
    return !!existingChannel
  }

  //#region public service
  async getChannelsByUserId(userId: string) {
    const members = await this.memberService._getByUserId({
      userId
    })
    const channels = await this.channelModel
      .find({
        _id: {
          $in: members.map(e => e.targetId)
        },
        isAvailable: true
      })
      .lean()
    return channels
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
  }) {
    await this.memberService._checkExisting({
      userId,
      targetId: teamId,
      inRoles: [EMemberRole.Admin, EMemberRole.Owner]
    })

    const createdChannel = new this.channelModel({
      ...channel,
      teamId,
      createdById: userId,
      modifiedById: userId
    })

    createdChannel.path = `${teamId.toString()}/${createdChannel._id.toString()}`
    createdChannel.save()

    await this.messageService._createSystemMessage({
      targetId: createdChannel._id.toString(),
      userId: userId,
      messagePayload: `Channel has been created by \$\{${userId}\}`,
      messageFor: EMessageFor.Channel
    })

    return {
      channel: createdChannel,
      members: []
    }
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

    await this.memberService._checkExisting({
      userId,
      targetId: id,
      inRoles: [EMemberRole.Owner, EMemberRole.Admin]
    })

    const channel = await this.channelModel.findOneAndUpdate(
      {
        _id: id,
        isAvailable: true
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
    await this.memberService._checkExisting({
      userId,
      targetId: id,
      inRoles: [EMemberRole.Owner]
    })

    const channel = await this.channelModel.findOneAndUpdate(
      {
        _id: id,
        isAvailable: true
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
