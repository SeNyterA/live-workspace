import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EMemberRole, EMemberType, Member } from '../member/member.schema'
import { MemberService } from '../member/member.service'
import { WorkspaceService } from '../workspace.service'
import { TCreateTeamPayload, TTeam, TUpdateTeamPayload } from './team.dto'
import { Team } from './team.schema'

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    private readonly memberService: MemberService,
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

  async getTeamsByUserId(userId: string): Promise<TTeam[]> {
    const members = await this.memberService._getByUserId({
      userId
    })
    const teams = await this.teamModel.find({
      _id: {
        $in: members.map(e => e.targetId)
      },
      isAvailable: true
    })
    return teams.map(e => e.toJSON())
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

    const rooms = [`team:${createdTeam._id.toString()}`, `user:${userId}`]

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
      member: owner
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

    const rooms = [`team:${id}`, `user:${userId}`]
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

    const rooms = [`team:${id}`, `user:${userId}`]
    this.workspaceService.team({
      rooms,
      data: {
        action: 'delete',
        team: team
      }
    })
    return true
  }
}
