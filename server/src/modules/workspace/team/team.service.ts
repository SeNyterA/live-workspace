import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EMemberType } from '../workspace.schema'
import {
  TCreateTeamPayload,
  TTeam,
  TTeamMemberPayload,
  TUpdateTeamPayload
} from './team.dto'
import { Team } from './team.schema'

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>
  ) {}

  async editMembers({
    id,
    userId,
    teamMembersPayload
  }: {
    id: string
    userId: string
    teamMembersPayload: TTeamMemberPayload[]
  }): Promise<boolean> {
    const team = await this.teamModel.findById({
      _id: id,
      isAvailable: true,
      'members.userId': userId,
      'members.type': { $in: [EMemberType.Owner, EMemberType.Admin] }
    })

    if (!team) {
      throw new ForbiddenException('Your dont have permission')
    }

    return true
  }

  //#region public service
  async getTeamsByUserId(userId: string): Promise<TTeam[]> {
    const teams = await this.teamModel.find({
      'members.userId': userId,
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
    const team = await this.teamModel.findById({
      _id: id,
      isAvailable: true,
      'members.userId': userId
    })

    if (!team) {
      throw new NotFoundException('Team not found')
    }

    return team.toJSON()
  }

  async create({
    team,
    userId
  }: {
    team: TCreateTeamPayload
    userId: string
  }): Promise<TTeam> {
    const createdTeam = new this.teamModel({
      ...team,
      createdById: userId,
      modifiedById: userId,
      members: [
        {
          userId,
          type: EMemberType.Owner
        }
      ]
    })

    createdTeam.save()
    return createdTeam
  }

  async update({
    id,
    teamPayload,
    userId
  }: {
    id: string
    teamPayload: TUpdateTeamPayload
    userId: string
  }): Promise<boolean> {
    const team = await this.teamModel.findByIdAndUpdate(
      {
        _id: id,
        isAvailable: true,
        'members.userId': userId,
        'members.type': { $in: [EMemberType.Owner, EMemberType.Admin] }
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
    return true
  }

  async delete({
    id,
    userId
  }: {
    id: string
    userId: string
  }): Promise<boolean> {
    const team = await this.teamModel.findByIdAndUpdate(
      {
        _id: id,
        isAvailable: true,
        'members.userId': userId,
        'members.type': EMemberType.Owner
      },
      {
        // $pull: { members: { userId, type: EMemberType.Owner } },
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
    return true
  }
  //#endregion
}
