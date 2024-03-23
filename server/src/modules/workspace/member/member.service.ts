import { ForbiddenException, Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import {
  MemberRole,
  MemberStatus,
  WorkspaceStatus,
  WorkspaceType
} from '@prisma/client'
import { Server } from 'socket.io'
import { Errors } from 'src/libs/errors'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { TJwtUser } from 'src/modules/socket/socket.gateway'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class MemberService {
  @WebSocketServer()
  server: Server
  constructor(private readonly prismaService: PrismaService) {}

  async getInvitions({ user }: { user: TJwtUser }) {
    const invitions = await this.prismaService.member.findMany({
      where: {
        userId: user.sub,
        status: MemberStatus.Invited
      },

      include: {
        workspace: {
          include: {
            avatar: true,
            thumbnail: true
          }
        },
        createdBy: true
      }
    })

    return { invitions }
  }

  async workpsaceMembers({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: user.sub,
        status: MemberStatus.Active,
        workspace: {
          id: workspaceId,
          isAvailable: true
        }
      }
    })

    if (!memberOperator) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    return this.prismaService.member.findMany({
      where: {
        workspaceId: workspaceId
      },
      include: {
        user: {
          include: {
            avatar: true
          }
        }
      }
    })
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
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: user.sub,
        status: MemberStatus.Active,
        role: MemberRole.Admin,
        workspace: {
          id: workspaceId,
          isAvailable: true
        }
      }
    })

    if (!memberOperator) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    const member = await this.prismaService.member.create({
      data: {
        workspaceId: workspaceId,
        userId: memberUserId,
        status: MemberStatus.Invited,
        createdById: user.sub,
        role: MemberRole.Member
      },
      include: {
        user: true
      }
    })

    return member
  }

  async acceptInvition({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    const memberUpdated = await this.prismaService.member.update({
      where: {
        userId_workspaceId: {
          userId: user.sub,
          workspaceId: workspaceId
        },
        status: MemberStatus.Invited
      },
      data: {
        status: MemberStatus.Active,
        modifiedById: user.sub
      },
      include: { workspace: true }
    })

    if (memberUpdated.workspace.type === WorkspaceType.Team) {
      const workspaceChidren = await this.prismaService.workspace.findMany({
        where: {
          workspaceParentId: workspaceId,
          isAvailable: true,
          status: WorkspaceStatus.Public
        }
      })

      await this.prismaService.member.createMany({
        data: workspaceChidren.map(child => ({
          workspaceId: child.id,
          userId: user.sub,
          status: MemberStatus.Active,
          role: MemberRole.Member
        }))
      })
    }

    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        OR: [{ workspaceParentId: workspaceId }, { id: workspaceId }],
        isAvailable: true,
        members: {
          some: {
            userId: user.sub,
            status: MemberStatus.Active
          }
        }
      },
      include: {
        avatar: true,
        thumbnail: true
      }
    })

    this.server.to(user.sub).emit('workspaces', { workspaces })

    return workspaces
  }

  async declineInvition({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    await this.prismaService.member.update({
      where: {
        userId_workspaceId: {
          userId: user.sub,
          workspaceId: workspaceId
        },
        status: MemberStatus.Invited
      },
      data: {
        status: MemberStatus.Declined,
        modifiedById: user.sub
      }
    })
  }

  async leaveWorkspace({
    user,
    workspaceId
  }: {
    workspaceId: string
    user: TJwtUser
  }) {
    await this.prismaService.member.update({
      where: {
        userId_workspaceId: {
          userId: user.sub,
          workspaceId: workspaceId
        },
        status: MemberStatus.Active
      },
      data: {
        status: MemberStatus.Leaved,
        modifiedById: user.sub
      }
    })
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
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: user.sub,
        status: MemberStatus.Active,
        role: MemberRole.Admin,
        workspace: {
          id: workspaceId,
          isAvailable: true
        }
      }
    })
    if (!memberOperator) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    const membersKicked = await this.prismaService.member.updateMany({
      where: {
        userId: userTargetId,
        OR: [
          {
            workspaceId: workspaceId
          },
          {
            workspace: {
              workspaceParentId: workspaceId
            }
          }
        ]
      },
      data: {
        status: MemberStatus.Kicked,
        modifiedById: user.sub
      }
    })
    return membersKicked
  }

  async editMemberRole({
    memberRole,
    user,
    workspaceId,
    userTargetId
  }: {
    memberRole: MemberRole
    user: TJwtUser
    workspaceId: string
    userTargetId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: user.sub,
        status: MemberStatus.Active,
        role: MemberRole.Admin,
        workspace: {
          id: workspaceId,
          isAvailable: true
        }
      }
    })

    if (!memberOperator) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    const memberUpdated = await this.prismaService.member.update({
      where: {
        userId_workspaceId: {
          userId: userTargetId,
          workspaceId: workspaceId
        }
      },
      data: {
        role: memberRole,
        modifiedById: user.sub
      }
    })

    return memberUpdated
  }
}
