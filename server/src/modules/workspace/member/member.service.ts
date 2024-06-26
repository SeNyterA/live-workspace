import { ForbiddenException, Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Member, MemberRole, MemberStatus } from '@prisma/client'
import { Server } from 'socket.io'
import { Errors } from 'src/libs/errors'
import { joinRooms, leaveRooms } from 'src/libs/helper'
import { PrismaService } from 'src/modules/prisma/prisma.service'

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

  async emitMember(member: Member, status?: 'leave' | 'join') {
    this.server.to(member.workspaceId).emit('member', { member })
    if (status === 'leave') {
      this.server.fetchSockets().then(sockets => {
        sockets.forEach(socket => {
          if (socket.id === member.userId) {
            socket.leave(member.workspaceId)
          }
        })
      })
    }
  }

  async getInvitions({ userId }: { userId: string }) {
    const invitions = await this.prismaService.member.findMany({
      where: {
        userId: userId,
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
    userId,
    workspaceId
  }: {
    userId: string
    workspaceId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
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
    userId,
    workspaceId,
    memberUserId
  }: {
    userId: string
    workspaceId: string
    memberUserId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
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
        createdById: userId,
        role: MemberRole.Member
      },
      include: {
        user: true
      }
    })
    this.server.to(memberUserId).emit('member', { member })
    return member
  }

  async acceptInvition({
    userId,
    workspaceId
  }: {
    userId: string
    workspaceId: string
  }) {
    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        isAvailable: true,
        OR: [
          {
            id: workspaceId,
            members: {
              some: {
                userId: userId,
                status: MemberStatus.Invited
              }
            }
          },
          {
            workspaceParent: {
              id: workspaceId,
              members: {
                some: {
                  userId: userId,
                  status: MemberStatus.Invited
                }
              }
            }
          }
        ]
      },
      include: {
        avatar: true,
        thumbnail: true
      }
    })

    const members = await Promise.all(
      workspaces.map(async workspace => {
        return this.prismaService.member.upsert({
          where: {
            status: MemberStatus.Invited,
            userId_workspaceId: {
              userId: userId,
              workspaceId: workspace.id
            }
          },
          update: {
            status: MemberStatus.Active,
            modifiedById: userId
          },
          create: {
            workspaceId: workspace.id,
            userId: userId,
            status: MemberStatus.Active,
            createdById: userId,
            role: MemberRole.Member
          },
          include: {
            user: { include: { avatar: true } }
          }
        })
      })
    )

    joinRooms({
      rooms: members.map(e => e.workspaceId),
      server: this.server,
      userId: userId
    })
    this.server.to(workspaceId).emit('member', { members })

    return {
      workspaces,
      members
    }
  }

  async declineInvition({
    userId,
    workspaceId
  }: {
    userId: string
    workspaceId: string
  }) {
    const member = await this.prismaService.member.update({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId
        },
        status: MemberStatus.Invited
      },
      data: {
        status: MemberStatus.Declined,
        modifiedById: userId
      }
    })

    this.server.to(workspaceId).emit('member', { member })
    return member
  }

  async leaveWorkspace({
    userId,
    workspaceId
  }: {
    workspaceId: string
    userId: string
  }) {
    const workspaceMembers = await this.prismaService.member.findMany({
      where: {
        userId: userId,
        status: MemberStatus.Active,
        OR: [
          {
            workspaceId: workspaceId,
            role: {
              not: MemberRole.Admin
            }
          },
          {
            workspace: {
              workspaceParentId: workspaceId
            }
          }
        ]
      }
    })

    const members = await Promise.all(
      workspaceMembers.map(async member => {
        return this.prismaService.member.update({
          where: {
            userId_workspaceId: {
              userId: member.userId,
              workspaceId: member.workspaceId
            }
          },
          data: {
            status: MemberStatus.Leaved,
            modifiedById: userId
          }
        })
      })
    )

    this.server.to(workspaceId).emit('member', { members })
    leaveRooms({
      server: this.server,
      userId: userId,
      rooms: members.map(e => e.workspaceId)
    })

    return members
  }

  async kickWorkspaceMember({
    userId,
    workspaceId,
    userTargetId
  }: {
    workspaceId: string
    userId: string
    userTargetId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
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

    const workspaceMembers = await this.prismaService.member.findMany({
      where: {
        userId: userTargetId,
        status: MemberStatus.Active,
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
      }
    })

    const kickedMembers = await Promise.all(
      workspaceMembers.map(async member => {
        return this.prismaService.member.update({
          where: {
            userId_workspaceId: {
              userId: member.userId,
              workspaceId: member.workspaceId
            }
          },
          data: {
            status: MemberStatus.Kicked,
            modifiedById: userId
          }
        })
      })
    )

    this.server.to(workspaceId).emit('member', { members: kickedMembers })
    leaveRooms({
      server: this.server,
      userId: userTargetId,
      rooms: kickedMembers.map(e => e.workspaceId)
    })

    return kickedMembers
  }

  async editMemberRole({
    memberRole,
    userId,
    workspaceId,
    userTargetId
  }: {
    memberRole: MemberRole
    userId: string
    workspaceId: string
    userTargetId: string
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
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
        modifiedById: userId
      }
    })

    this.server.to(workspaceId).emit('member', { member: memberUpdated })

    return memberUpdated
  }
}
