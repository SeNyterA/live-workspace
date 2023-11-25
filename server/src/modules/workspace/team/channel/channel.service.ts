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
import { getChannelPermission } from 'src/libs/checkPermistion'
import { Errors } from 'src/libs/errors'
import { User } from 'src/modules/users/user.schema'
import { UsersService } from 'src/modules/users/users.service'
import { EMemberRole, EMemberType, Member } from '../../member/member.schema'
import { MemberService } from '../../member/member.service'
import { EMessageFor } from '../../message/message.schema'
import { MessageService } from '../../message/message.service'
import { MembersDto } from '../../workspace.dto'
import { WorkspaceService } from '../../workspace.service'
import { Team } from '../team.schema'
import { TeamService } from '../team.service'
import { ChannelDto, UpdateChannelDto } from './channel.dto'
import { Channel } from './channel.schema'

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
    readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => TeamService))
    readonly teamService: TeamService,
    @Inject(forwardRef(() => UsersService))
    readonly usersService: UsersService
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

    const [member, channel] = await Promise.all([_member, _target])

    if (member && channel) {
      return {
        permissions: getChannelPermission(member.role),
        member,
        channel
      }
    }
    return {
      member,
      channel
    }
  }

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
    return {
      channels,
      members
    }
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
          error: 'Member already exists in the channel'
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

      this.workspaceService.workspaces({
        rooms: [targetId, member.userId],
        workspaces: [{ action: 'create', data: _member, type: 'member' }]
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

  async _create({
    channelDto: { channelType, members: memberDto, ...createData },
    userId,
    teamId
  }: {
    channelDto: ChannelDto
    userId: string
    teamId: string
  }) {
    const { permissions: teamPermissions, member: teamMember } =
      await this.teamService.getPermisstion({
        targetId: teamId,
        userId
      })

    if (!teamPermissions?.createChannel)
      return {
        error: {
          code: Errors['User dont has permission to create channel'],
          userId,
          teamId
        }
      }

    const newChannel = await this.channelModel.create({
      ...createData,
      channelType,
      teamId,
      createdById: userId,
      modifiedById: userId
    })

    // const _membersDto: MemberDto[] = [
    //   { role: EMemberRole.Owner, userId },
    //   ...(memberDto?.filter(e => e.userId !== userId) || [])
    // ]

    // const memberCreations = _membersDto?.map(async memberDto => {
    //   const user = await this.usersService.userModel.findOne({
    //     isAvailable: true,
    //     _id: memberDto.userId
    //   })
    //   if (!user) {
    //     return {
    //       error: {
    //         code: Errors['User not found or disabled'],
    //         userId: memberDto.userId
    //       }
    //     }
    //   }

    //   const teamMember = await this.memberService._checkExisting({
    //     targetId: teamId,
    //     userId: memberDto.userId
    //   })
    //   if (!teamMember) {
    //     console.log(Errors['User not found on team'])
    //     return {
    //       error: {
    //         code: Errors['User not found on team'],
    //         userId: memberDto.userId,
    //         teamId
    //       }
    //     }
    //   }

    //   const newMember = await this.memberModel.create({
    //     ...memberDto,
    //     targetId: newChannel._id.toString(),
    //     path: `${teamId.toString()}/${newChannel._id.toString()}`,
    //     type: EMemberType.Channel,
    //     createdById: userId,
    //     modifiedById: userId
    //   })

    //   return {
    //     member: newMember.toJSON(),
    //     user: user.toJSON()
    //   }
    // })

    // const createdMembers = await Promise.all(memberCreations)

    console.log([
      { role: EMemberRole.Owner, userId },
      ...(memberDto?.filter(e => e.userId !== userId) || [])
    ])

    const members = await this._addMembers({
      channelId: newChannel._id.toString(),
      userId,
      payload: {
        members: [
          { role: EMemberRole.Owner, userId },
          ...(memberDto?.filter(e => e.userId !== userId) || [])
        ]
      }
    })

    console.log(members)

    // const resMemnbers = createdMembers
    //   .filter(entry => !!entry.member)
    //   .map(entry => entry.member)

    // const usersId = createdMembers
    //   .filter(entry => !!entry.user)
    //   .map(entry => entry.user._id.toString())

    // const response: TWorkspaceSocket[] = [
    //   {
    //     type: 'channel',
    //     action: 'create',
    //     data: newChannel
    //   },
    //   ...resMemnbers.map(
    //     member =>
    //       ({
    //         type: 'member',
    //         action: 'create',
    //         data: member
    //       } as TWorkspaceSocket)
    //   )
    // ]

    // this.workspaceService.workspaces({
    //   rooms: usersId,
    //   workspaces: response
    // })

    // return {
    //   channel: newChannel,
    //   members: createdMembers
    // }
  }

  async _addMembers({
    channelId,
    payload: { members: membersDto },
    userId,
    option: {
      checkExistingMember = true,
      checkExistingTeamMember = true,
      checkExistingUser = true,
      checkPermisstion = true,
      checkRolePermission = true,
      emitSocket = true
    },
    teamId
  }: {
    payload: MembersDto
    userId: string
    channelId: string
    teamId?: string
    channel?: Channel
    option?: {
      checkPermisstion?: boolean
      checkRolePermission?: boolean
      checkExistingUser?: boolean
      checkExistingTeamMember?: boolean
      checkExistingMember?: boolean
      emitSocket?: boolean
    }
  }) {
    const { permissions } = await this.getPermisstion({
      targetId: channelId,
      userId
    })

    if (!permissions && checkPermisstion) {
      return {
        error: { code: Errors['User not found on channel'], userId, channelId }
      }
    }

    const _members = membersDto.map(async memberDto => {
      if (
        !permissions?.memberAction?.add?.includes(memberDto.role) &&
        checkRolePermission
      ) {
        return {
          error: {
            code: Errors['User dont has permission to add member to channel'],
            userId,
            channelId,
            targetUserId: memberDto.role
          }
        }
      }

      const user = await this.usersService.userModel.findOne({
        isAvailable: true,
        _id: memberDto.userId
      })
      if (!user && checkExistingUser) {
        return {
          error: {
            code: Errors['User not found or disabled'],
            userId: memberDto.userId
          }
        }
      }

      const teamMember = await this.memberService._checkExisting({
        targetId: channelId,
        userId: memberDto.userId
      })
      if (!teamMember && checkExistingTeamMember) {
        return {
          error: {
            code: Errors['User not found on team'],
            userId: memberDto.userId,
            teamId
          }
        }
      }

      const existingMember = await this.memberService.memberModel.findOne({
        targetId: channelId,
        userId: memberDto.userId
      })
      if (!existingMember && checkExistingMember) {
        return {
          error: {
            code: Errors['Channel member has existing'],
            userId: memberDto.userId,
            channelId: channelId
          }
        }
      }

      const newMember = await this.memberModel.create({
        ...memberDto,
        targetId: channelId,
        path: `${teamMember.targetId.toString()}/${channelId}`,
        type: EMemberType.Channel,
        createdById: userId,
        modifiedById: userId
      })

      return {
        member: newMember,
        user: user.toJSON()
      }
    })

    const members = await Promise.all(_members)

    if (emitSocket) {
      const socketMembers = members.filter(e => !!e.member).map(e => e.member)
      this.workspaceService.workspaces({
        rooms: [channelId, ...socketMembers.map(e => e._id.toString())],
        workspaces: socketMembers.map(member => ({
          action: 'create',
          type: 'member',
          data: member
        }))
      })
    }

    return members
  }
}
