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
import { User } from 'src/modules/users/user.schema'
import { EMemberRole, EMemberType, Member } from '../../member/member.schema'
import { MemberService } from '../../member/member.service'
import { EMessageFor } from '../../message/message.schema'
import { MessageService } from '../../message/message.service'
import { EStatusType } from '../../workspace.schema'
import { WorkspaceService } from '../../workspace.service'
import { Team } from '../team.schema'
import { CreateChannelDto, UpdateChannelDto } from './channel.dto'
import { Channel } from './channel.schema'
import { getChannelPermission } from 'src/libs/checkPermistion'

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) readonly channelModel: Model<Channel>,
    @InjectModel(Team.name) readonly teamModel: Model<Team>,
    @InjectModel(Member.name) readonly memberModel: Model<Member>,
    @InjectModel(User.name) readonly userModel: Model<User>,

    readonly memberService: MemberService,
    @Inject(forwardRef(() => MessageService))
    readonly messageService: MessageService,
    @Inject(forwardRef(() => WorkspaceService))
    readonly workspaceService: WorkspaceService
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

  async getPermisstion({
    targetId,
    userId
  }: {
    targetId: string
    userId: string
  }) {
    const _member = this.memberService.memberModel.findOne({
      userId,
      targetId: targetId,
      isAvailable: true
    })
    const _target = this.channelModel.findOne({
      _id: targetId,
      isAvailable: true
    })

    const [member, target] = await Promise.all([_member, _target])

    if (member && target) {
      return {
        permissions: getChannelPermission(member.role),
        member,
        target
      }
    }
    return {
      member,
      target
    }
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

    const createdChannel = await this.channelModel.create({
      ...channel,
      teamId,
      createdById: userId,
      modifiedById: userId
    })

    const owner = await this.memberModel.create({
      userId,
      targetId: createdChannel._id.toString(),
      path: createdChannel._id.toString(),
      type: EMemberType.Channel,
      role: EMemberRole.Owner,
      createdById: userId,
      modifiedById: userId
    })

    if (createdChannel.channelType === EStatusType.Public) {
    }

    const message = await this.messageService._createSystemMessage({
      targetId: createdChannel._id.toString(),
      userId: userId,
      messagePayload: `Channel has been created by \$\{${userId}\}`,
      messageFor: EMessageFor.Channel
    })

    return {
      channel: createdChannel,
      members: [owner],
      messages: [message]
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

  async addMember({
    targetId,
    userId,
    member
  }: {
    targetId: string
    userId: string
    member: {
      userId: string
      role: EMemberRole
    }
  }) {
    const { permissions } = await this.getPermisstion({
      targetId,
      userId
    })

    if (permissions?.memberAction?.add?.includes(member.role)) {
      const newMember = await this.memberModel.findOne({
        targetId: targetId,
        userId: member.userId
      })

      if (newMember) {
        return {
          success: false,
          error: 'Member already exists in the group'
        }
      }

      const user = await this.userModel.findOne({
        _id: member.userId,
        isAvailable: true
      })

      if (!user) {
        return {
          success: false,
          error: 'User does not exist or is unavailable'
        }
      }

      const _member = await this.memberModel.create({
        userId: member.userId,
        targetId: targetId,
        path: targetId,
        type: EMemberType.Team,
        role: member.role,
        createdById: userId,
        modifiedById: userId
      })

      const _message = await this.messageService._createSystemMessage({
        targetId,
        userId: userId,
        messagePayload: `\$\{${member.userId}\} has been added to channel by \$\{${userId}\}`,
        messageFor: EMessageFor.Channel
      })

      this.workspaceService.member({
        data: {
          action: 'create',
          member: _member
        },
        rooms: [targetId, member.userId]
      })

      this.workspaceService.message({
        data: {
          action: 'create',
          message: _message
        },
        rooms: [targetId, member.userId]
      })

      return {
        success: true
      }
    }
    return {
      success: false,
      error: 'No permission to add the user to the team'
    }
  }
}
