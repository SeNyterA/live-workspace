import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import {
  EMemberRole,
  EMemberStatus,
  Member,
  RoleWeights
} from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import {
  Workspace,
  WorkspaceStatus,
  WorkspaceType
} from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { Brackets, In, Repository } from 'typeorm'

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
export class MemberService {
  @WebSocketServer()
  server: Server
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  async getInvitions({ user }: { user: TJwtUser }) {
    const invitions = await this.memberRepository.find({
      where: {
        user: { _id: user.sub, isAvailable: true },
        status: EMemberStatus.Invited,
        isAvailable: true
      },
      relations: [
        'workspace',
        'createdBy',
        'workspace.avatar',
        'workspace.thumbnail',
        'createdBy.avatar'
      ]
    })

    return {
      invitions
    }
  }

  async inviteMember({
    user,
    workspaceId,
    email
  }: {
    user: TJwtUser
    workspaceId: string
    email: string
  }) {
    const member = await this.memberRepository.findOne({
      where: {
        workspace: { _id: workspaceId, isAvailable: true },
        user: { email, isAvailable: true }
      },
      relations: ['workspace']
    })

    if (member?.status === EMemberStatus.Active) {
      throw new Error('User already in workspace')
    }

    const invition = await this.memberRepository.save({
      ...member,
      role: EMemberRole.Member,
      status: EMemberStatus.Invited,
      user: { email, isAvailable: true },
      workspace: { _id: workspaceId, isAvailable: true },
      createdBy: { _id: user.sub },
      modifiedBy: { _id: user.sub }
    })

    this.server.to([invition.userId, workspaceId]).emit('invition', {
      invition
    })
  }

  async acceptInvition({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    const member = await this.memberRepository.findOneOrFail({
      where: {
        workspace: { isAvailable: true, _id: workspaceId },
        user: { _id: user.sub, isAvailable: true },
        status: EMemberStatus.Invited,
        isAvailable: true
      },
      relations: ['workspace']
    })

    const newMember = await this.memberRepository.save({
      ...member,
      status: EMemberStatus.Active,
      modifiedBy: { _id: user.sub }
    })

    console.log(newMember)

    if (member.workspace.type === WorkspaceType.Team) {
      const children = await this.workspaceRepository.find({
        where: {
          parent: { _id: workspaceId },
          isAvailable: true,
          status: WorkspaceStatus.Public
        }
      })
      const aa = await this.memberRepository.insert(
        children.map(child => ({
          workspace: { _id: child._id },
          status: EMemberStatus.Active,
          user: { _id: user.sub },
          createdBy: { _id: member.createdById },
          role: EMemberRole.Member
        }))
      )
      console.log(aa)
    }
  }

  async declineInvition({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    const _memberDeclined = await this.memberRepository.update(
      {
        workspace: { isAvailable: true, _id: workspaceId },
        user: { _id: user.sub, isAvailable: true },
        status: EMemberStatus.Invited,
        isAvailable: true
      },
      {
        status: EMemberStatus.Declined,
        modifiedBy: { _id: user.sub }
      }
    )

    return _memberDeclined
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
        isAvailable: true,
        status: EMemberStatus.Active,
        workspace: { _id: workspaceId, isAvailable: true },
        user: { _id: user.sub, isAvailable: true }
      }
    })

    const members = await this.memberRepository.find({
      where: { workspace: { _id: workspaceId, isAvailable: true } },
      relations: ['user', 'user.avatar']
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
}
