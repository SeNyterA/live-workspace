import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { getBoardPermission } from 'src/libs/checkPermistion'
import { Errors } from 'src/libs/errors'
import { User } from 'src/modules/users/user.schema'
import { UsersService } from 'src/modules/users/users.service'
import { EMemberRole, EMemberType, Member } from '../../member/member.schema'
import { MemberService } from '../../member/member.service'
import { MessageService } from '../../message/message.service'
import { MembersDto } from '../../workspace.dto'
import { TWorkspaceSocket, WorkspaceService } from '../../workspace.service'
import { Team } from '../team.schema'
import { TeamService } from '../team.service'
import { BoardDto } from './board.dto'
import { Board } from './board.schema'

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) readonly boardModel: Model<Board>,
    @InjectModel(Team.name) readonly teamModel: Model<Team>,
    @InjectModel(Member.name) readonly memberModel: Model<Member>,
    @InjectModel(User.name) readonly userModel: Model<User>,

    readonly memberService: MemberService,
    @Inject(forwardRef(() => MessageService))
    readonly messageService: MessageService,
    @Inject(forwardRef(() => WorkspaceService))
    readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => TeamService))
    readonly teamService: TeamService,
    @Inject(forwardRef(() => UsersService))
    readonly usersService: UsersService
  ) {}

  async _checkExisting({ boardId }: { boardId: string }): Promise<boolean> {
    const existingBoard = await this.boardModel.findOne({
      _id: boardId,
      isAvailable: true
    })
    if (!existingBoard) {
      throw new ForbiddenException('Your dont have permission')
    }
    return !!existingBoard
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
      isAvailable: true
    })
    const _target = this.boardModel.findOne({
      _id: targetId,
      isAvailable: true
    })

    const [member, board] = await Promise.all([_member, _target])

    if (member && board) {
      return {
        permissions: getBoardPermission(member.role),
        member,
        board
      }
    }
    return {
      member,
      board
    }
  }

  async getBoardsByUserId(userId: string) {
    const _members = await this.memberService._getByUserId({
      userId
    })
    const boards = await this.boardModel
      .find({
        _id: {
          $in: _members.map(e => e.targetId.toString())
        },
        isAvailable: true
      })
      .lean()

    const members = await this.memberService.memberModel
      .find({
        targetId: { $in: boards.map(team => team._id.toString()) }
      })
      .lean()

    return {
      boards,
      members
    }
  }

  async getBoardById({
    id,
    userId
  }: {
    id: string
    userId: string
  }): Promise<Board> {
    const board = await this.boardModel.findOne({
      _id: id,
      isAvailable: true,
      'members.userId': userId
    })

    if (!board) {
      throw new NotFoundException('Board not found')
    }

    return board.toJSON()
  }

  async _create({
    boardDto: { members: membersDto, ...createData },
    userId,
    teamId
  }: {
    boardDto: BoardDto
    userId: string
    teamId: string
  }) {
    const { permissions: teamPermissions } =
      await this.teamService.getPermisstion({
        targetId: teamId,
        userId
      })

    if (!teamPermissions?.createBoard)
      return {
        error: {
          code: Errors['User dont has permission to create board'],
          userId,
          teamId
        }
      }

    const newBoard = await this.boardModel.create({
      ...createData,
      teamId,
      createdById: userId,
      modifiedById: userId
    })

    const {
      memberAction: { add: addMemberPermission }
    } = getBoardPermission(EMemberRole.Owner)

    console.log(addMemberPermission)

    const _newMember = [
      { role: EMemberRole.Owner, userId },
      ...(membersDto?.filter(e => e.userId !== userId) || [])
    ].map(async memberDto => {
      if (!addMemberPermission.includes(memberDto.role)) {
        return {
          error: {
            code: Errors['User dont has permission to add member to channel'],
            userId,
            boardId: newBoard._id.toString()
          }
        }
      }

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
      }

      const newMember = await this.memberModel.create({
        ...memberDto,
        targetId: newBoard._id.toString(),
        path: `${teamId}/${newBoard._id.toString()}`,
        type: EMemberType.Board,
        createdById: userId,
        modifiedById: userId
      })
      return {
        member: newMember,
        user: user.toJSON()
      }
    })

    const newMember = await Promise.all(_newMember)

    const validMembers = newMember
      .filter(entry => !!entry.member)
      .map(entry => entry.member)
    const validUsers = newMember
      .filter(entry => !!entry.user)
      .map(entry => entry.user)
    const response: TWorkspaceSocket[] = [
      {
        type: 'board',
        action: 'create',
        data: newBoard
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

  async _addMembers({
    boardId,
    payload: { members: membersDto },
    userId
  }: {
    payload: MembersDto
    userId: string
    boardId: string
  }) {
    const { permissions, board } = await this.getPermisstion({
      targetId: boardId,
      userId
    })

    if (!permissions) {
      return {
        error: { code: Errors['User not found on board'], userId, boardId }
      }
    }

    const _members = membersDto.map(async memberDto => {
      if (!permissions?.memberAction?.add?.includes(memberDto.role)) {
        return {
          error: {
            code: Errors['User dont has permission to add member to board'],
            userId,
            boardId,
            targetUserId: memberDto.role
          }
        }
      }

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
      }

      const teamMember = await this.memberService._checkExisting({
        targetId: boardId,
        userId: memberDto.userId
      })
      if (!teamMember) {
        return {
          error: {
            code: Errors['User not found on team'],
            userId: memberDto.userId,
            teamId: board.teamId.toString()
          }
        }
      }

      const existingMember = await this.memberService.memberModel.findOne({
        targetId: boardId,
        userId: memberDto.userId
      })
      if (!existingMember) {
        return {
          error: {
            code: Errors['Board member has existing'],
            userId: memberDto.userId,
            boardId: boardId
          }
        }
      }

      const newMember = await this.memberModel.create({
        ...memberDto,
        targetId: boardId,
        path: `${teamMember.targetId.toString()}/${boardId}`,
        type: EMemberType.Board,
        createdById: userId,
        modifiedById: userId
      })
      return {
        member: newMember,
        user: user.toJSON()
      }
    })

    const members = await Promise.all(_members)
    const socketMembers = members.filter(e => !!e.member).map(e => e.member)
    this.workspaceService.workspaces({
      rooms: [boardId, ...socketMembers.map(e => e._id.toString())],
      workspaces: socketMembers.map(member => ({
        action: 'create',
        type: 'member',
        data: member
      }))
    })

    return members
  }
}
