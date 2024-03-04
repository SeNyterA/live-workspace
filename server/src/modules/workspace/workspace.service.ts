import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import * as crypto from 'crypto-js'
import { Server, Socket } from 'socket.io'
import { File } from 'src/entities/file.entity'
import { EMemberRole, Member, RoleWeights } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'

import { Brackets, In, Repository } from 'typeorm'
import { TJwtUser } from '../socket/socket.gateway'
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

const checkPermission = async ({
  operatorRole,
  targetRole = EMemberRole.Member
}: {
  operatorRole: EMemberRole
  targetRole?: EMemberRole
}) => {
  if (
    RoleWeights[operatorRole] >= RoleWeights[targetRole] &&
    RoleWeights[operatorRole] > RoleWeights[EMemberRole.Member]
  ) {
    return true
  }
  return false
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
    private readonly fileRepository: Repository<File>
  ) {}

  //#region Workspace
  async createUsersFakeData() {
    const count = await this.userRepository.count()

    return await this.userRepository.insert(
      Array(10000)
        .fill(1)
        .map(() => ({
          email:
            generateRandomHash(Math.random().toString(), 10) + '@gmail.com',
          userName: generateRandomHash(Math.random().toString(), 10),
          password: crypto.SHA256('123123').toString(),
          nickName: generateRandomHash(Math.random().toString(), 10),
          isAvailable: true
        }))
    )
  }

  async createGroup({
    user,
    workspace
  }: {
    workspace: Workspace
    user: TJwtUser
  }) {
    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Group,
        displayUrl: generateRandomHash(),
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      })
    )

    const member = await this.memberRepository.save(
      this.memberRepository.create({
        role: EMemberRole.Owner,

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
    workspaceId,
    user,
    workspace
  }: {
    user: TJwtUser
    workspaceId: string
    workspace: Workspace
  }) {
    const _workspace = await this.workspaceRepository.findOneOrFail({
      where: {
        _id: workspaceId,
        members: {
          user: { _id: user.sub },
          role: In([EMemberRole.Owner, EMemberRole.Admin])
        }
      }
    })

    await this.workspaceRepository.save({
      ..._workspace,
      modifiedBy: { _id: user.sub },
      ...workspace
    })
    const workspaceUpdated = await this.workspaceRepository.findOneOrFail({
      where: { _id: workspaceId },
      relations: ['avatar', 'thumbnail']
    })

    this.server
      .to(workspaceId)
      .emit('workspace', { workspace: workspaceUpdated })
    return { workspace: workspaceUpdated }
  }

  async deleteWorkspace({ _id, user }: { user: TJwtUser; _id: string }) {
    await this.memberRepository.findOneOrFail({
      where: [
        {
          isAvailable: true,
          workspace: { _id, isAvailable: true },
          user: { _id: user.sub, isAvailable: true },
          role: EMemberRole.Owner
        },
        {
          isAvailable: true,
          workspace: {
            _id,
            isAvailable: true,
            parent: {
              isAvailable: true,
              members: {
                isAvailable: true,
                user: {
                  _id: user.sub,
                  isAvailable: true
                },
                role: EMemberRole.Owner
              }
            }
          }
        }
      ]
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

  async addMember({
    member,
    user,
    workspaceId
  }: {
    member: Member
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

    if (
      !checkPermission({
        operatorRole: operator.role,
        targetRole: member.role
      }) ||
      !checkPermission({ operatorRole: operator.role, targetRole: member.role })
    ) {
      throw new Error('Permission denied')
    }

    this.memberRepository.save({
      ...member,

      user: { _id: member.userId },
      workspace: { _id: workspaceId },
      createdBy: { _id: user.sub },
      modifiedBy: { _id: user.sub }
    })
  }

  async editMember({
    member,
    user,
    workspaceId,
    memberId
  }: {
    member: Member
    user: TJwtUser
    workspaceId: string
    memberId: string
  }) {
    const operator = await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub },
        workspace: { _id: workspaceId, isAvailable: true },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    const target = await this.memberRepository.findOneOrFail({
      where: {
        _id: memberId,
        user: { isAvailable: true },
        workspace: { _id: workspaceId, isAvailable: true }
      }
    })

    if (
      !checkPermission({
        operatorRole: operator.role,
        targetRole: target.role
      }) ||
      !checkPermission({ operatorRole: operator.role, targetRole: member.role })
    ) {
      throw new Error('Permission denied')
    }

    await this.memberRepository.save({
      ...target,
      ...member,
      modifiedBy: { _id: user.sub }
    })

    const memberUpdated = await this.memberRepository.findOneOrFail({
      where: { _id: target._id },
      relations: ['user']
    })

    this.server.to(workspaceId).emit('member', {
      member: memberUpdated,
      action: 'update'
    })

    return { member: memberUpdated }
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

  async findPotentialMembers({
    keyword,
    skip,
    take,
    workspaceId
  }: {
    keyword: string
    skip: number
    take: number
    workspaceId: string
  }) {
    const workspace = await this.workspaceRepository.findOneOrFail({
      where: { _id: workspaceId, isAvailable: true }
    })

    let users

    if (workspace.parentId) {
      users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.members', 'member')
        .where('user.isAvailable = :isAvailable', { isAvailable: true })
        .andWhere('member.workspaceId = :parentId', {
          parentId: workspace.parentId
        })
        .andWhere('member.workspaceId != :workspaceId', {
          workspaceId: workspace._id
        })
        .andWhere(
          new Brackets(qb => {
            qb.where('user.userName LIKE :keyword', { keyword: `%${keyword}%` })
              .orWhere('user.email LIKE :keyword', { keyword: `%${keyword}%` })
              .orWhere('user.nickName LIKE :keyword', {
                keyword: `%${keyword}%`
              })
          })
        )
        .skip(skip)
        .take(take)
        .getMany()
    } else {
      users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoin('user.members', 'member')
        .where('user.isAvailable = :isAvailable', { isAvailable: true })
        .andWhere('member.workspaceId != :workspaceId', {
          workspaceId: workspace._id
        })
        .andWhere(
          new Brackets(qb => {
            qb.where('user.userName LIKE :keyword', { keyword: `%${keyword}%` })
              .orWhere('user.email LIKE :keyword', { keyword: `%${keyword}%` })
              .orWhere('user.nickName LIKE :keyword', {
                keyword: `%${keyword}%`
              })
          })
        )
        .skip(skip)
        .take(take)
        .getMany()
    }

    return users
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

  //#region Direct

  //#endregion
}
