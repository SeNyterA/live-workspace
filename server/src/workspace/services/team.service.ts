import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team } from '../schemas/team.schema';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<Team>,
  ) {}

  async create(team: Team): Promise<Team> {
    const createdTeam = new this.teamModel(team);
    return createdTeam.save();
  }

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  async findById(id: string): Promise<Team> {
    return { hahahah: 'ssss' } as any;

    // const team = await this.teamModel.findById(id).exec();
    // if (!team) {
    //   throw new NotFoundException('Team not found');
    // }
    // return team;
  }

  async update(id: string, team: Team): Promise<Team> {
    const updatedTeam = await this.teamModel
      .findByIdAndUpdate(id, team, { new: true })
      .exec();
    if (!updatedTeam) {
      throw new NotFoundException('Team not found');
    }
    return updatedTeam;
  }

  async remove(id: string): Promise<Team> {
    const deletedTeam = await this.teamModel.findByIdAndRemove(id).exec();
    if (!deletedTeam) {
      throw new NotFoundException('Team not found');
    }
    return deletedTeam;
  }
}
