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
import { checkPermission } from 'src/libs/helper'
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
        status: MemberStatus.Invited,
        isAvailable: true
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
        isAvailable: true,
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
        isAvailable: true,
        userId: user.sub,
        status: MemberStatus.Active,
        role: {
          in: [MemberRole.Owner, MemberRole.Admin]
        },
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
    const member = await this.prismaService.member.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: user.sub,
        status: MemberStatus.Invited,
        isAvailable: true
      }
    })

    if (!member) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    const memberUpdated = await this.prismaService.member.update({
      where: {
        id: member.id
      },
      data: {
        status: MemberStatus.Active,
        modifiedById: user.sub
      },
      include: { workspace: true }
    })

    if (memberUpdated.workspace.type === WorkspaceType.Team) {
      const children = await this.prismaService.workspace.findMany({
        where: {
          workspaceParentId: workspaceId,
          isAvailable: true,
          status: WorkspaceStatus.Public
        }
      })

      await this.prismaService.member.createMany({
        data: children.map(child => ({
          workspaceId: child.id,
          status: MemberStatus.Active,
          userId: user.sub,
          createdById: member.createdById,
          role: MemberRole.Member
        }))
      })
    }
  }

  async declineInvition({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    const member = await this.prismaService.member.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: user.sub,
        status: MemberStatus.Invited,
        isAvailable: true
      }
    })

    if (!member) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    await this.prismaService.member.update({
      where: {
        id: member.id
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
    const member = await this.prismaService.member.findFirst({
      where: {
        workspaceId: workspaceId,
        userId: user.sub,
        status: MemberStatus.Active,
        isAvailable: true
      }
    })

    if (!member) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    await this.prismaService.member.update({
      where: {
        id: member.id
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
        isAvailable: true,
        userId: user.sub,
        status: MemberStatus.Active,
        role: {
          in: [MemberRole.Owner, MemberRole.Admin]
        },
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

    if (
      checkPermission({
        operatorRole: memberOperator.role,
        targetRole: MemberRole.Member
      })
    ) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }
  }

  async editMemberRole({
    memberRole,
    user,
    workspaceId,
    memberId
  }: {
    memberRole: MemberRole
    user: TJwtUser
    workspaceId: string
    memberId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        isAvailable: true,
        userId: user.sub,
        status: MemberStatus.Active,
        role: {
          in: [MemberRole.Owner, MemberRole.Admin]
        },
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

    if (
      checkPermission({
        operatorRole: memberOperator.role,
        targetRole: memberRole
      })
    ) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    const memberUpdated = await this.prismaService.member.update({
      where: {
        id: memberId
      },
      data: {
        role: memberRole,
        modifiedById: user.sub
      }
    })

    return memberUpdated
  }
}
