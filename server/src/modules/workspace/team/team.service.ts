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
import { Errors } from 'src/libs/errors'
import { User } from 'src/modules/users/user.schema'
import { UsersService } from 'src/modules/users/users.service'
import { EMemberRole, EMemberType, Member } from '../member/member.schema'
import { MemberService } from '../member/member.service'
import { MemberDto } from '../workspace.dto'
import {
  TBoardEmit,
  TWorkspaceSocket,
  WorkspaceService
} from '../workspace.service'
import { BoardService } from './board/board.service'
import { EFieldType } from './board/property/property.schema'
import { PropertyService } from './board/property/property.service'
import { ChannelService } from './channel/channel.service'
import { TTeam, TUpdateTeamPayload, TeamDto } from './team.dto'
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

    @Inject(forwardRef(() => BoardService))
    readonly boardService: BoardService,
    @Inject(forwardRef(() => PropertyService))
    readonly propertyService: PropertyService,

    @Inject(forwardRef(() => WorkspaceService))
    readonly workspaceService: WorkspaceService,

    @Inject(forwardRef(() => UsersService))
    readonly usersService: UsersService
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
      isAvailable: true,
      isAccepted: true
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
      target
    }
  }

  async getTeamsByUserId(userId: string) {
    const _members = await this.memberService._getByUserId({
      userId
    })

    const teams = await this.teamModel
      .find({
        _id: {
          $in: _members.map(e => e.targetId.toString())
        },
        isAvailable: true
      })
      .lean()

    const members = await this.memberService.memberModel
      .find({
        targetId: { $in: teams.map(team => team._id.toString()) },
        isAccepted: true
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

  async _create({
    teamDto: { channelTitles, members: memberDto, ...teamDto },
    userId
  }: {
    teamDto: TeamDto
    userId: string
  }) {
    const newTeam = (
      await this.teamModel.create({
        ...teamDto,
        createdById: userId,
        modifiedById: userId
      })
    ).toJSON()

    const _membersDto: MemberDto[] = [
      { role: EMemberRole.Owner, userId },
      ...(memberDto?.filter(e => e.userId !== userId) || [])
    ]
    const _teamMembers = _membersDto?.map(async memberDto => {
      const user = await this.usersService.userModel.findOne({
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
    const teamMembers = await Promise.all(_teamMembers)

    const validMembers = teamMembers
      .filter(entry => !!entry.member)
      .map(entry => entry.member)
    const validUsers = teamMembers
      .filter(entry => !!entry.user)
      .map(entry => entry.user)
    const response: TWorkspaceSocket[] = [
      {
        type: 'team',
        action: 'create',
        data: newTeam
      },
      ...validMembers.map(
        member =>
          ({
            type: 'member',
            action: 'create',
            data: member
          }) as TWorkspaceSocket
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

    //createChannel
    channelTitles?.map(async channelTitle => {
      const newChannel = await this.channelService.channelModel.create({
        title: channelTitle,
        teamId: newTeam._id.toString(),
        createdById: userId,
        modifiedById: userId
      })
      const _channelMembers = validMembers.map(
        async teamMember =>
          await this.memberModel.create({
            userId: teamMember.userId.toString(),
            targetId: newChannel._id.toString(),
            role: teamMember.role,
            path: `${teamMember.targetId.toString()}/${newChannel._id.toString()}`,
            type: EMemberType.Channel,
            createdById: userId,
            modifiedById: userId
          })
      )
      const channelMembers = await Promise.all(_channelMembers)
      this.workspaceService.workspaces({
        rooms: channelMembers.map(({ userId }) => userId.toString()),
        workspaces: [
          { type: 'channel', action: 'create', data: newChannel.toJSON() },
          ...channelMembers.map(
            channelMember =>
              ({
                type: 'member',
                action: 'create',
                data: channelMember
              }) as TWorkspaceSocket
          )
        ]
      })
    }) || []
    ;['Daily tasks'].map(async boardTitle => {
      const newBoard = await this.boardService.boardModel.create({
        title: boardTitle,
        teamId: newTeam._id.toString(),
        createdById: userId,
        modifiedById: userId
      })

      // properties
      const _properties = [
        {
          title: 'Status',
          fieldType: EFieldType.Select,
          fieldOption: [
            {
              title: 'Pending',
              color: '#333'
            },
            {
              title: 'In progress',
              color: '#333'
            },
            {
              title: 'Todo',
              color: '#333'
            },
            {
              title: 'Merge request',
              color: '#333'
            },
            {
              title: 'Tesing',
              color: '#333'
            },
            {
              title: 'Bug',
              color: '#333'
            },
            {
              title: 'Fixed',
              color: '#333'
            },
            {
              title: 'Done',
              color: '#333'
            }
          ]
        },
        {
          title: 'Assignees',
          fieldType: EFieldType.Assignees
        },
        {
          title: 'Progress',
          fieldType: EFieldType.String
        }
      ].map(
        async propertyData =>
          await this.propertyService.propertyModel.create({
            ...propertyData,
            boardId: newBoard._id.toString(),
            createdById: userId,
            modifiedById: userId
          })
      )
      const properties = await Promise.all(_properties)

      // members
      const _boardMembers = validMembers.map(
        async teamMember =>
          await this.memberModel.create({
            userId: teamMember.userId.toString(),
            targetId: newBoard._id.toString(),
            role: teamMember.role,
            path: `${teamMember.targetId.toString()}/${newBoard._id.toString()}`,
            type: EMemberType.Board,
            createdById: userId,
            modifiedById: userId
          })
      )
      const boardMembers = await Promise.all(_boardMembers)

      // workspaces emit
      this.workspaceService.workspaces({
        rooms: boardMembers.map(({ userId }) => userId.toString()),
        workspaces: [
          { type: 'board', action: 'create', data: newBoard.toJSON() },
          ...boardMembers.map(
            boardMember =>
              ({
                type: 'member',
                action: 'create',
                data: boardMember
              }) as TWorkspaceSocket
          )
        ]
      })

      // board data emit
      this.workspaceService.boardEmit({
        rooms: boardMembers.map(({ userId }) => userId.toString()),
        boardData: [
          ...properties.map(
            property =>
              ({
                type: 'property',
                action: 'create',
                data: property
              }) as TBoardEmit
          )
        ]
      })
    }) || []

    return response
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
    this.workspaceService.workspaces({
      rooms,
      workspaces: [{ action: 'update', data: team, type: 'team' }]
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

    this.workspaceService.workspaces({
      rooms: [team._id.toString(), userId],
      workspaces: [{ action: 'delete', type: 'team', data: team }]
    })
    return true
  }
}
