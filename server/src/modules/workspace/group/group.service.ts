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
import { EError } from 'src/libs/errors'
import { UsersService } from 'src/modules/users/users.service'
import { EMemberRole, EMemberType, Member } from '../member/member.schema'
import { MemberService } from '../member/member.service'
import { CreateWorkspaceDto, UpdateWorkspaceDto } from '../workspace.dto'
import { TWorkspaceSocket, WorkspaceService } from '../workspace.service'
import { Group } from './group.schema'

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,

    private readonly memberService: MemberService,
    private readonly userService: UsersService,

    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService
  ) {}

  async _checkExisting({ groupId }: { groupId: string }) {
    const existingGroup = await this.groupModel.findOne({
      _id: groupId,
      isAvailable: true
    })

    if (!existingGroup) {
      throw new ForbiddenException('Your dont have permission')
    }

    return true
  }

  async getGroupsByUserId(userId: string) {
    const members = await this.memberService._getByUserId({
      userId
    })

    const groups = await this.groupModel
      .find({
        _id: {
          $in: members.map(e => e.targetId)
        },
        isAvailable: true
      })
      .lean()

    return {
      groups,
      members
    }
  }

  async getGroupById({ id, userId }: { id: string; userId: string }) {
    await this.memberService._checkExisting({
      userId,
      targetId: id,
      inRoles: [EMemberRole.Admin, EMemberRole.Owner, EMemberRole.Member]
    })

    const group = await this.groupModel.findOne({
      _id: id,
      isAvailable: true
    })

    if (!group) {
      throw new NotFoundException('Group not found')
    }

    return group.toJSON()
  }

  async create({
    groupDto: { members, ...createData },
    userId
  }: {
    groupDto: CreateWorkspaceDto
    userId: string
  }) {
    const createdGroup = await this.groupModel.create({
      ...createData,
      createdById: userId,
      modifiedById: userId
    })

    const ownerMember = await this.memberModel.create({
      userId,
      targetId: createdGroup._id.toString(),
      path: createdGroup._id.toString(),
      type: EMemberType.Group,
      role: EMemberRole.Owner,
      createdById: userId,
      modifiedById: userId
    })

    const memberCreations = members
      ?.filter(user => user.userId !== userId)
      ?.map(async memberDto => {
        const user = await this.userService.userModel.findOne({
          isAvailable: true,
          _id: memberDto.userId
        })

        if (!user) {
          return {
            error: {
              code: EError['User not found or disabled'],
              userId: memberDto.userId
            }
          }
        } else {
          const newMember = await this.memberModel.create({
            userId: memberDto.userId,
            role: memberDto.role,
            targetId: createdGroup._id.toString(),
            path: createdGroup._id.toString(),
            type: EMemberType.Group,
            createdById: userId,
            modifiedById: userId
          })
          return {
            member: newMember.toJSON(),
            user: user.toJSON()
          }
        }
      })

    const createdMembers = await Promise.all(memberCreations)

    const socketMembers = [
      ownerMember,
      ...createdMembers
        .filter(entry => !!entry.member)
        .map(entry => entry.member)
    ]

    this.workspaceService.workspaces({
      rooms: socketMembers.map(entry => entry._id),
      workspaces: [
        {
          type: 'group',
          action: 'create',
          data: createdGroup.toJSON()
        },
        ...socketMembers.map(
          member =>
            ({
              type: 'member',
              action: 'create',
              data: member
            } as TWorkspaceSocket)
        )
      ]
    })

    return {
      group: createdGroup,
      members: createdMembers,
      owner: ownerMember
    }
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

    await this.memberService._checkExisting({
      userId,
      targetId: id,
      inRoles: [EMemberRole.Admin, EMemberRole.Owner]
    })

    const group = await this.groupModel.findByIdAndUpdate(
      {
        _id: id,
        isAvailable: true
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
    await this.memberService._checkExisting({
      userId,
      targetId: id,
      inRoles: [EMemberRole.Owner]
    })

    const group = await this.groupModel.findOneAndUpdate(
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

    if (!group) {
      throw new ForbiddenException('Your dont have permission')
    }
    return true
  }
}
