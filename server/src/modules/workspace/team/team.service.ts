import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { checkPermission } from 'src/libs/checkPermistion'
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
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly memberService: MemberService,

    @Inject(forwardRef(() => ChannelService))
    private readonly channelService: ChannelService,

    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService
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
    return teams
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
      targetId: string
      role: EMemberRole
    }
  }) {
    const operator = await this.memberModel.findOne({
      targetId: teamId,
      userId: userId,
      isAvailable: true
    })

    if (!operator) {
      return {
        success: false,
        message: 'The adding user does not have the required permissions'
      }
    }

    const newMember = await this.memberModel.findOne({
      targetId: teamId,
      userId: member.userId
    })

    if (newMember) {
      return { success: false, message: 'Member already exists in the group' }
    }

    const user = await this.userModel.findOne({
      _id: member.userId,
      isAvailable: true
    })

    if (!user) {
      return {
        success: false,
        message: 'User does not exist or is unavailable'
      }
    }

    if (checkPermission(operator.role, member.role)) {
      const members = await this.memberModel.create({
        userId: member.userId,
        targetId: teamId,
        path: teamId,
        type: EMemberType.Team,
        role: member.role,
        createdById: userId,
        modifiedById: userId
      })

      return { success: true, data: members }
    }

    return {
      success: false,
      message: 'No permission to add the user to the team'
    }
  }
}
