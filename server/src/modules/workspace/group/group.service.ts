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
import { Errors } from 'src/libs/errors'
import { UsersService } from 'src/modules/users/users.service'
import { EMemberRole, EMemberType, Member } from '../member/member.schema'
import { MemberService } from '../member/member.service'
import { MemberDto, UpdateWorkspaceDto } from '../workspace.dto'
import { TWorkspaceSocket, WorkspaceService } from '../workspace.service'
import { GroupDto } from './group.dto'
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
    groupDto: GroupDto
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
            code: Errors['User not found or disabled'],
            userId: memberDto.userId
          }
        }
      }

      const newMember = await this.memberModel.create({
        ...memberDto,
        targetId: newGroup,
        path: newGroup,
        type: EMemberType.Group,
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
          type: 'group',
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

  async _create({
    groupDto: { members: memberDto, ...groupDto },
    userId
  }: {
    groupDto: GroupDto
    userId: string
  }) {
    const newTeam = (
      await this.groupModel.create({
        ...groupDto,
        createdById: userId,
        modifiedById: userId
      })
    ).toJSON()

    const _membersDto: MemberDto[] = [
      { role: EMemberRole.Owner, userId },
      ...(memberDto?.filter(e => e.userId !== userId) || [])
    ]
    const _groupMembers = _membersDto?.map(async memberDto => {
      const user = await this.userService.userModel.findOne({
        isAvailable: true,
        _id: memberDto.userId
      })
      if (!user) {
        return {
          error: {
            code: Errors['User not found or disabled'],
            userId: memberDto.userId
          }
        }
      } else {
        const newMember = await this.memberModel.create({
          ...memberDto,
          targetId: newTeam._id.toString(),
          path: newTeam._id.toString(),
          type: EMemberType.Team,
          createdById: userId,
          modifiedById: userId
        })
        return {
          member: newMember.toJSON(),
          user: user.toJSON()
        }
      }
    })
    const groupMembers = await Promise.all(_groupMembers)

    const validMembers = groupMembers
      .filter(entry => !!entry.member)
      .map(entry => entry.member)
    const validUsers = groupMembers
      .filter(entry => !!entry.user)
      .map(entry => entry.user)
    const response: TWorkspaceSocket[] = [
      {
        type: 'group',
        action: 'create',
        data: newTeam
      },
      ...validMembers.map(
        member =>
          ({
            type: 'member',
            action: 'create',
            data: member
          } as TWorkspaceSocket)
      )
    ]

    this.workspaceService.workspaces({
      rooms: validMembers.map(e => e.userId.toString()),
      workspaces: response
    })

    this.workspaceService.users({
      rooms: validUsers.map(e => e._id.toString()),
      users: validUsers.map(e => ({ type: 'get', data: e }))
    })

    return response
  }
}
