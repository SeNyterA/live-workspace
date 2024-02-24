import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketServer } from '@nestjs/websockets'
import * as crypto from 'crypto-js'
import { Server, Socket } from 'socket.io'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { In, Repository } from 'typeorm'
import { BoardService } from './team/board/board.service'

export type TWorkspaceSocket = {
  action: 'create' | 'update' | 'delete'
  data: Workspace
}

export type TMemberEmit = {
  action: 'create' | 'update' | 'delete'
  member: Member
}

export const generateRandomHash = (
  inputString = Math.random().toString()
): string => {
  const hash = crypto.SHA256(inputString).toString()
  const truncatedHash = hash.substring(0, 8)
  return truncatedHash
}

@Injectable()
export class WorkspaceService {
  @WebSocketServer()
  server: Server
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    readonly boardService: BoardService
  ) {}

  //#region Workspace
  async createTeam({
    user,
    workspace
  }: {
    workspace: Workspace
    user: TJwtUser
  }) {
    console.log(workspace)
    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Team,
        displayUrl: generateRandomHash(),

        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      })
    )

    const member = await this.memberRepository.save(
      this.memberRepository.create({
        role: EMemberRole.Owner,
        type: EMemberType.Team,

        modifiedBy: { _id: user.sub },
        createdBy: { _id: user.sub },
        user: { _id: user.sub },
        workspace: { _id: newWorkspace._id }
      })
    )

    if (true) {
      // Fetch 100 users from the database
      const users = await this.userRepository.find({
        take: 1000
      })

      // Create a new member for each user in the workspace
      await this.memberRepository.insert(
        users.map(user => ({ user, workspace: newWorkspace }))
      )
    }

    await this.boardService.createBoard({
      teamId: newWorkspace._id,
      user,
      workspace: {
        title: 'Main Board',
        description: 'Main board for team',
        parent: { _id: newWorkspace._id } as Workspace,
        type: WorkspaceType.Board,
        displayUrl: generateRandomHash(),
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      } as Workspace
    })

    await this.createChannel({
      user,
      workspace: {
        title: 'General',
        description: 'General channel for team',
        parent: { _id: newWorkspace._id } as Workspace,
        type: WorkspaceType.Channel,
        displayUrl: generateRandomHash(),
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      } as Workspace,
      teamId: newWorkspace._id
    })

    return {
      workspace: newWorkspace,
      member
    }
  }

  async createChannel({
    user,
    workspace,
    teamId
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        workspace: { _id: teamId },
        user: { _id: user.sub },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Channel,
        displayUrl: generateRandomHash(),

        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        parent: { _id: teamId }
      })
    )

    const member = await this.memberRepository.save(
      this.memberRepository.create({
        role: EMemberRole.Owner,
        type: EMemberType.Channel,

        user: { _id: user.sub },
        workspace: { _id: newWorkspace._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      })
    )

    return {
      workspace: newWorkspace,
      member
    }
  }

  async createGroup({
    user,
    workspace,
    teamId
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
  }) {
    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Group,
        displayUrl: generateRandomHash(),

        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        parent: { _id: teamId }
      })
    )

    const member = await this.memberRepository.save(
      this.memberRepository.create({
        role: EMemberRole.Owner,
        type: EMemberType.Group,

        user: { _id: user.sub },
        workspace: { _id: newWorkspace._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      })
    )

    return {
      workspace: newWorkspace,
      member
    }
  }

  async updateWorkspace({
    _id,
    user,
    workspace
  }: {
    user: TJwtUser
    _id: string
    workspace: Workspace
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        workspace: { _id },
        user: { _id: user.sub },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    return this.workspaceRepository.update(_id, workspace)
  }

  async deleteWorkspace({ _id, user }: { user: TJwtUser; _id: string }) {
    await this.memberRepository.findOneOrFail({
      where: {
        workspace: { _id },
        user: { _id: user.sub },
        role: EMemberRole.Owner
      }
    })

    return this.workspaceRepository.delete(_id)
  }

  async getAllWorkspace({ user }: { user: TJwtUser }) {
    const workspaces = await this.workspaceRepository.find({
      where: { members: { user: { _id: user.sub, isAvailable: true } } }
    })

    return workspaces
  }

  async getWorkspaceById({
    workspaceId,
    user
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    const workspace = await this.workspaceRepository.findOneOrFail({
      where: {
        _id: workspaceId,
        members: { user: { _id: user.sub, isAvailable: true } }
      }
    })

    const members = await this.memberRepository.find({
      where: { workspace: { _id: workspaceId } },
      relations: ['user']
    })
    return { workspace, members }
  }

  async subscribeToWorkspaces({
    user,
    client
  }: {
    user: TJwtUser
    client: Socket
  }) {
    const members = await this.memberRepository.find({
      where: { user: { _id: user.sub, isAvailable: true } }
    })

    client.join(members.map(member => member.targetId))
  }

  //#endregion

  //#region  Member
  async addMembers({
    membersDto,
    user,
    workspaceId
  }: {
    membersDto: Member[]
    user: TJwtUser
    workspaceId: string
  }) {
    const operator = await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub },
        workspace: { _id: workspaceId },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    if (operator.role === EMemberRole.Owner) {
      membersDto.forEach(member => {
        this.memberRepository.save({
          ...member,
          workspace: { _id: workspaceId },
          createdBy: { _id: user.sub },
          modifiedBy: { _id: user.sub }
        })
      })
    }

    if (operator.role === EMemberRole.Admin) {
      membersDto.forEach(member => {
        this.memberRepository.save({
          ...member,
          role:
            member.role === EMemberRole.Owner ? EMemberRole.Admin : member.role,
          workspace: { _id: workspaceId },
          createdBy: { _id: user.sub },
          modifiedBy: { _id: user.sub }
        })
      })
    }
  }

  async workpsaceMembers({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        workspace: { _id: workspaceId },
        user: { _id: user.sub, isAvailable: true }
      }
    })

    const members = await this.memberRepository.find({
      where: { workspace: { _id: workspaceId, isAvailable: true } },
      relations: ['user']
    })

    return members
  }
  //#endregion

  //#region SocketEmit
  async workspaceEmit({
    workspaces,
    rooms
  }: {
    workspaces: TWorkspaceSocket
    rooms: string[]
  }) {
    await this.server.to(rooms).emit('workspaces', {
      workspaces
    })
  }

  async memberEmit({
    members,
    rooms
  }: {
    members: TMemberEmit[]
    rooms: string[]
  }) {
    const sockets = await this.server.fetchSockets()

    members.forEach(async member => {
      if (member.action === 'create') {
        sockets
          .find(socket => socket.rooms.has(member.member.targetId))
          ?.join(member.member.targetId)
      }
    })

    await this.server.to(rooms).emit('members', {
      members
    })
  }
  //#endregion
}
