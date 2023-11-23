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
import {
  CreateWorkspaceDto,
  MemberDto,
  UpdateWorkspaceDto
} from '../workspace.dto'
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
    groupDto: { members: memberDto, ...createData },
    userId
  }: {
    groupDto: CreateWorkspaceDto
    userId: string
  }) {
    const newGroup = await this.groupModel.create({
      ...createData,
      createdById: userId,
      modifiedById: userId
    })

    //#region members
    const _membersDto: MemberDto[] = [
      { role: EMemberRole.Owner, userId },
      ...(memberDto?.filter(e => e.userId !== userId) || [])
    ]

    const memberCreations = _membersDto?.map(async memberDto => {
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
      }

      const newMember = await this.memberModel.create({
        ...memberDto,
        targetId: newGroup,
        path: newGroup,
        type: EMemberType.Team,
        createdById: userId,
        modifiedById: userId
      })
      return {
        member: newMember.toJSON(),
        user: user.toJSON()
      }
    })

    const createdMembers = await Promise.all(memberCreations)
    //#endregion

    //#region res, socket
    const resMemnbers = createdMembers
      .filter(entry => !!entry.member)
      .map(entry => entry.member)

    const usersId = createdMembers
      .filter(entry => !!entry.user)
      .map(entry => entry.user._id.toString())

    this.workspaceService.workspaces({
      rooms: usersId,
      workspaces: [
        {
          type: 'team',
          action: 'create',
          data: newGroup
        },
        ...resMemnbers.map(
          member =>
            ({
              type: 'member',
              action: 'create',
              data: member
            } as TWorkspaceSocket)
        )
      ]
    })
    //#endregion

    return {
      group: newGroup
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
