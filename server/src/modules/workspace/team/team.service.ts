import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { getTeamPermission } from 'src/libs/checkPermistion'
import { User } from 'src/modules/users/user.schema'
import { EMemberRole, EMemberType, Member } from '../member/member.schema'
import { MemberService } from '../member/member.service'
import { EStatusType } from '../workspace.schema'
import { WorkspaceService } from '../workspace.service'
import { ChannelService } from './channel/channel.service'
import { TCreateTeamPayload, TTeam, TUpdateTeamPayload } from './team.dto'
import { Team } from './team.schema'

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) readonly teamModel: Model<Team>,
    @InjectModel(Member.name) readonly memberModel: Model<Member>,
    @InjectModel(User.name) readonly userModel: Model<User>,
    readonly memberService: MemberService,

    @Inject(forwardRef(() => ChannelService))
    readonly channelService: ChannelService,

    @Inject(forwardRef(() => WorkspaceService))
    readonly workspaceService: WorkspaceService
  ) {}

  async _checkExisting({ teamId }: { teamId: string }) {
    const existingTeam = await this.teamModel.findOne({
      _id: teamId,
      isAvailable: true
    })
    if (!existingTeam) {
      throw new ForbiddenException('Your dont have permission')
    }
    return !!existingTeam
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
    const _target = this.teamModel.findOne({
      _id: targetId,
      isAvailable: true
    })

    const [member, target] = await Promise.all([_member, _target])

    if (member && target) {
      return {
        permissions: getTeamPermission(member.role),
        member,
        target
      }
    }
    return {
      member,
      target,
      permissions: {}
    }
  }

  async getTeamsByUserId(userId: string) {
    const members = await this.memberService._getByUserId({
      userId
    })
    const teams = await this.teamModel
      .find({
        _id: {
          $in: members.map(e => e.targetId)
        },
        isAvailable: true
      })
      .lean()
    return {
      teams,
      members
    }
  }

  async getTeamById({
    id,
    userId
  }: {
    id: string
    userId: string
  }): Promise<TTeam> {
    await this.memberService._checkExisting({
      userId,
      targetId: id
    })
    const team = await this.teamModel.findById({
      _id: id,
      isAvailable: true
    })
    if (!team) {
      throw new NotFoundException('Team not found')
    }
    return team.toJSON()
  }

  async create({ team, userId }: { team: TCreateTeamPayload; userId: string }) {
    const createdTeam = await this.teamModel.create({
      ...team,
      createdById: userId,
      modifiedById: userId
    })
    const owner = await this.memberModel.create({
      userId,
      targetId: createdTeam._id.toString(),
      path: createdTeam._id.toString(),
      type: EMemberType.Team,
      role: EMemberRole.Owner,
      createdById: userId,
      modifiedById: userId
    })

    const channelData = await this.channelService.create({
      channel: {
        channelType: EStatusType.Public,
        title: 'General'
      },
      teamId: createdTeam._id.toString(),
      userId: userId
    })

    const rooms = [createdTeam._id.toString(), userId]
    this.workspaceService.team({
      rooms,
      data: {
        action: 'create',
        team: createdTeam
      }
    })
    this.workspaceService.member({
      rooms,
      data: {
        action: 'create',
        member: owner
      }
    })

    return {
      team: createdTeam,
      member: owner,
      channelData: channelData
    }
  }

  async update({
    id,
    teamPayload,
    userId
  }: {
    id: string
    teamPayload: TUpdateTeamPayload
    userId: string
  }) {
    await this.memberService._checkExisting({
      userId,
      targetId: id,
      isAvailable: true,
      inRoles: [EMemberRole.Owner, EMemberRole.Admin]
    })

    const team = await this.teamModel.findByIdAndUpdate(
      {
        _id: id,
        isAvailable: true
      },
      {
        $set: {
          ...teamPayload,
          updatedAt: new Date(),
          modifiedById: userId
        }
      },
      { new: true }
    )
    if (!team) {
      throw new ForbiddenException('Your dont have permission')
    }

    const rooms = [team._id.toString(), userId]
    this.workspaceService.team({
      rooms,
      data: {
        action: 'update',
        team: team
      }
    })

    return { team }
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
    const team = await this.teamModel.findByIdAndUpdate(
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
    if (!team) {
      throw new ForbiddenException('Your dont have permission')
    }

    const rooms = [team._id.toString(), userId]
    this.workspaceService.team({
      rooms,
      data: {
        action: 'delete',
        team: team
      }
    })
    return true
  }

  async addMember({
    teamId,
    userId,
    member
  }: {
    teamId: string
    userId: string
    member: {
      userId: string
      role: EMemberRole
    }
  }) {
    const { permissions } = await this.getPermisstion({
      targetId: teamId,
      userId
    })

    if (permissions?.memberAction?.add?.includes(member.role)) {
      const newMember = await this.memberModel.findOne({
        targetId: teamId,
        userId: member.userId,
        isAvailable: true
      })

      if (newMember) {
        return { success: false, error: 'Member already exists in the group' }
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

      const members = await this.memberModel.create({
        userId: member.userId,
        targetId: teamId,
        path: teamId,
        type: EMemberType.Team,
        role: member.role,
        createdById: userId,
        modifiedById: userId
      })

      const _channels = this.channelService.channelModel
        .find({
          teamId,
          isAvailable: true
        })
        .lean()

      const [channels] = await Promise.all([_channels])

      console.log(channels)

      const _createChannelsMember = channels.map(channel =>
        this.channelService.addMember({
          member,
          targetId: channel._id.toString(),
          userId
        })
      )

      const channelsMember = await Promise.all(_createChannelsMember)

      return { success: true, data: members, channelsMember }
    }
    return {
      success: false,
      error: 'No permission to add the user to the team'
    }
  }

  async editMember({
    teamId,
    userId,
    memberId,
    role
  }: {
    teamId: string
    userId: string
    memberId: string
    role: EMemberRole
  }) {
    console.log('ssss', role as any)
    const { permissions } = await this.getPermisstion({
      targetId: teamId,
      userId
    })

    if (permissions?.memberAction?.toggleRole?.includes(role)) {
      const updatedMember = await this.memberModel.findOneAndUpdate(
        { _id: memberId, targetId: teamId, isAvailable: true },
        { role: role, modifiedById: userId, updatedAt: new Date() },
        { new: true }
      )

      if (updatedMember) {
        return { success: true, data: updatedMember }
      } else {
        return { success: false, error: 'Member not found or not available' }
      }
    }
    return {
      success: false,
      error: 'No permission to update the user role in the team'
    }
  }
}
