import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from '../schemas/group.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

  async create(group: Group): Promise<Group> {
    const createdGroup = new this.groupModel(group);
    return createdGroup.save();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findById(id: string): Promise<Group> {
    const group = await this.groupModel.findById(id).exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async update(id: string, updatedGroup: Partial<Group>): Promise<Group> {
    const group = await this.groupModel
      .findByIdAndUpdate(id, updatedGroup, { new: true })
      .exec();
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async remove(id: string): Promise<Group> {
    const deletedGroup = await this.groupModel.findByIdAndRemove(id).exec();
    if (!deletedGroup) {
      throw new NotFoundException('Group not found');
    }
    return deletedGroup;
  }
}
