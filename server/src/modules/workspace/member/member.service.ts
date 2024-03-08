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
import { In, Not, Repository } from 'typeorm'

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

  async workpsaceMembers({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        status: EMemberStatus.Active,
        isAvailable: true,
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

  async inviteMember({
    user,
    workspaceId,
    memberUserId
  }: {
    user: TJwtUser
    workspaceId: string
    memberUserId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: workspaceId, isAvailable: true },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    const invition = await this.memberRepository.update(
      {
        user: { _id: memberUserId, isAvailable: true },
        workspace: {
          _id: workspaceId,
          isAvailable: true,
          type: In([
            WorkspaceType.Direct,
            WorkspaceType.Group,
            WorkspaceType.Team
          ])
        }
      },
      {
        modifiedBy: { _id: user.sub },
        role: EMemberRole.Member,
        status: EMemberStatus.Invited
      }
    )
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

    await this.memberRepository.save({
      ...member,
      status: EMemberStatus.Active,
      modifiedBy: { _id: user.sub }
    })

    if (member.workspace.type === WorkspaceType.Team) {
      const children = await this.workspaceRepository.find({
        where: {
          parent: { _id: workspaceId },
          isAvailable: true,
          status: WorkspaceStatus.Public
        }
      })
      await this.memberRepository.insert(
        children.map(child => ({
          workspace: { _id: child._id },
          status: EMemberStatus.Active,
          user: { _id: user.sub },
          createdBy: { _id: member.createdById },
          role: EMemberRole.Member
        }))
      )
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

  async leaveWorkspace({
    user,
    workspaceId
  }: {
    workspaceId: string
    user: TJwtUser
  }) {
    const members = await this.memberRepository.find({
      where: {
        workspace: [
          { _id: workspaceId, isAvailable: true },
          { parent: { _id: workspaceId, isAvailable: true }, isAvailable: true }
        ],
        user: { _id: user.sub, isAvailable: true }
      }
    })
    const leavedMembers = await this.memberRepository.save(
      members.map(member => ({
        ...member,
        status: EMemberStatus.Leaved,
        modifiedBy: { _id: user.sub }
      }))
    )
    return leavedMembers
  }

  async kickWorkspaceMember({
    user,
    workspaceId,
    userTargetId
  }: {
    workspaceId: string
    user: TJwtUser
    userTargetId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: workspaceId, isAvailable: true },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    const members = await this.memberRepository.find({
      where: {
        workspace: [
          { _id: workspaceId, isAvailable: true },
          { parent: { _id: workspaceId, isAvailable: true }, isAvailable: true }
        ],
        user: { _id: userTargetId, isAvailable: true }
      }
    })
    const leavedMembers = await this.memberRepository.save(
      members.map(member => ({
        ...member,
        status: EMemberStatus.Leaved,
        modifiedBy: { _id: user.sub }
      }))
    )
    return leavedMembers
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
}
