import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { isEmpty } from 'lodash'
import { Model } from 'mongoose'
import {
  CreateWorkspaceDto,
  MemberDto,
  UpdateWorkspaceDto
} from '../workspace.dto'
import { EGroupMemberType, Group } from './group.schema'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>
  ) {}

  async editMembers({
    id,
    userId,
    groupMembersPayload
  }: {
    id: string
    userId: string
    groupMembersPayload: MemberDto[]
  }): Promise<boolean> {
    const group = await this.groupModel.findById({
      _id: id,
      isAvailable: true,
      'members.userId': userId,
      'members.type': {
        $in: [EGroupMemberType.Owner, EGroupMemberType.Admin]
      }
    })

    if (!group) {
      throw new ForbiddenException('Your dont have permission')
    }

    return true
  }

  //#region public service
  async getGroupsByUserId(userId: string): Promise<Group[]> {
    const groups = await this.groupModel.find({
      'members.userId': userId,
      isAvailable: true
    })

    return groups.map(e => e.toJSON())
  }

  async getGroupById({
    id,
    userId
  }: {
    id: string
    userId: string
  }): Promise<Group> {
    const group = await this.groupModel.findOne({
      _id: id,
      isAvailable: true,
      'members.userId': userId
    })

    if (!group) {
      throw new NotFoundException('Group not found')
    }

    return group.toJSON()
  }

  async create({
    group,
    userId
  }: {
    group: CreateWorkspaceDto
    userId: string
  }): Promise<Group> {
    const createdGroup = new this.groupModel({
      ...group,
      createdById: userId,
      modifiedById: userId,
      members: [
        {
          userId,
          type: EGroupMemberType.Owner
        }
      ]
    })

    createdGroup.save()
    return createdGroup
  }

  async update({
    id,
    groupPayload,
    userId
  }: {
    id: string
    groupPayload: UpdateWorkspaceDto
    userId: string
  }) {
    if (isEmpty(groupPayload)) {
      throw new BadRequestException('Bad request')
    }

    const group = await this.groupModel.findByIdAndUpdate(
      {
        _id: id,
        isAvailable: true,
        'members.userId': userId,
        'members.type': {
          $in: [EGroupMemberType.Owner, EGroupMemberType.Admin]
        }
      },
      {
        $set: {
          ...groupPayload,
          updatedAt: new Date(),
          modifiedById: userId
        }
      },
      { new: true }
    )

    if (!group) {
      throw new ForbiddenException('Your dont have permission')
    }
    return group.toJSON()
  }

  async delete({
    id,
    userId
  }: {
    id: string
    userId: string
  }): Promise<boolean> {
    const group = await this.groupModel.findOneAndUpdate(
      {
        _id: id,
        isAvailable: true,
        'members.userId': userId,
        'members.type': EGroupMemberType.Owner
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

    if (!group) {
      throw new ForbiddenException('Your dont have permission')
    }
    return true
  }
  //#endregion
}
