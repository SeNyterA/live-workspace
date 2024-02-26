import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import * as crypto from 'crypto-js'
import { Server, Socket } from 'socket.io'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import {
  Workspace,
  WorkspaceStatus,
  WorkspaceType
} from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { In, Not, Repository } from 'typeorm'
import { BoardService } from './team/board/board.service'
import { File } from 'src/entities/file.entity'
export type TWorkspaceSocket = {
  action: 'create' | 'update' | 'delete'
  data: Workspace
}

export type TMemberEmit = {
  action: 'create' | 'update' | 'delete'
  member: Member
}

export const generateRandomHash = (
  inputString = Math.random().toString(),
  length = 8
): string => {
  const hash = crypto.SHA256(inputString).toString()
  const truncatedHash = hash.substring(0, length)
  return truncatedHash
}

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
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
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,

    readonly boardService: BoardService
  ) {}

  //#region Workspace
  async createUsersFakeData() {
    const count = await this.userRepository.count()
    console.log(count)
    return await this.userRepository.insert(
      Array(10000)
        .fill(1)
        .map(() => ({
          email:
            generateRandomHash(Math.random().toString(), 10) + '@gmail.com',
          userName: generateRandomHash(Math.random().toString(), 10),
          password: crypto.SHA256('123123').toString(),
          nickname: generateRandomHash(Math.random().toString(), 10),
          isAvailable: true
        }))
    )
  }

  async createTeam({
    user,
    workspace,
    boards,
    channels
  }: {
    user: TJwtUser
    workspace: Workspace
    channels?: Workspace[]
    boards?: Workspace[]
  }) {
    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Team,
        displayUrl: generateRandomHash(),
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      })
    )

    const users = await this.userRepository.find({
      take: 99
    })

    const _member = await this.memberRepository.insert([
      {
        role: EMemberRole.Owner,
        type: EMemberType.Team,
        modifiedBy: { _id: user.sub },
        createdBy: { _id: user.sub },
        user: { _id: user.sub },
        workspace: newWorkspace
      },
      ...users.map(e => ({
        user: { _id: e._id },
        role: EMemberRole.Member,
        type: EMemberType.Team,
        modifiedBy: { _id: user.sub },
        createdBy: { _id: user.sub },
        workspace: newWorkspace
      }))
    ])
    const team = await this.workspaceRepository.findOneOrFail({
      where: { _id: newWorkspace._id },
      relations: ['avatar', 'thumbnail']
    })
    this.server
      .to([team._id, ..._member.identifiers.map(e => e._id)])
      .emit('workspace', { workspace: team })

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

    channels?.map(channelInfo =>
      this.createChannel({
        user,
        workspace: {
          ...channelInfo,
          parent: { _id: newWorkspace._id } as Workspace,
          type: WorkspaceType.Channel,
          displayUrl: generateRandomHash(),
          createdBy: { _id: user.sub },
          modifiedBy: { _id: user.sub }
        } as Workspace,
        teamId: newWorkspace._id
      })
    )

    return {
      team
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

    const newWorkspace = await this.workspaceRepository.insert({
      ...workspace,
      type: WorkspaceType.Channel,
      displayUrl: generateRandomHash(),
      status: WorkspaceStatus.Public,
      createdBy: { _id: user.sub },
      modifiedBy: { _id: user.sub },
      parent: { _id: teamId }
    })

    const workpsaceMembers =
      newWorkspace.generatedMaps[0].status === WorkspaceStatus.Public
        ? await this.memberRepository.find({
            where: {
              workspace: { _id: teamId },
              isAvailable: true,
              user: { _id: Not(user.sub), isAvailable: true }
            }
          })
        : []

    const members = await this.memberRepository.insert([
      {
        role: EMemberRole.Owner,
        type: EMemberType.Channel,
        user: { _id: user.sub },
        workspace: { _id: newWorkspace.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      },
      ...workpsaceMembers.map(member => ({
        role: EMemberRole.Member,
        type: EMemberType.Channel,
        user: { _id: member.userId },
        workspace: { _id: newWorkspace.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      }))
    ])

    return {
      workspace: newWorkspace,
      members
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
      where: { members: { user: { _id: user.sub, isAvailable: true } } },
      relations: ['avatar', 'thumbnail']
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
      },
      relations: ['avatar', 'thumbnail']
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

    client.join([...members.map(member => member.targetId), user.sub])
  }

  async subscribeToWorkspace(workspaceId: string, membersId: string[]) {
    const sockets = await this.server.fetchSockets()
    membersId.forEach(memberId => {
      sockets.forEach(socket => {
        socket.rooms.has(memberId) && socket.join(workspaceId)
      })
    })
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

  async memberEmit({ member, action }: TMemberEmit) {
    // if (action === 'update') {
    //   return this.server.to(member._id).emit('member', { member })
    // }

    const sockets = await this.server.to(member.userId).fetchSockets()
    console.log(sockets.length)

    // if (action === 'create') {
    //   return sockets.forEach(socket => {
    //     socket.rooms.has(member.userId) && socket.join(member.targetId)
    //   })
    // }

    // if (action === 'delete') {
    //   return sockets.forEach(socket => {
    //     socket.rooms.has(member.userId) && socket.leave(member.targetId)
    //   })
    // }
  }

  async membersEmit({ members }: { members: TMemberEmit[] }) {
    const usersId = members.map(e => e.member.userId)

    await this.server.emit('members', {
      members
    })
  }
  //#endregion

  async getWorkspaceFiles({
    workspaceId,
    user
  }: {
    workspaceId: string
    user: TJwtUser
  }) {
    await this.workspaceRepository.findOneOrFail({
      where: {
        _id: workspaceId,
        members: {
          user: { _id: user.sub, isAvailable: true },
          isAvailable: true
        },
        isAvailable: true
      }
    })

    const files = await this.fileRepository.find({
      where: {
        isAvailable: true,
        messages: [{ target: { _id: workspaceId }, isAvailable: true }]
      }
    })

    return files
  }
}
