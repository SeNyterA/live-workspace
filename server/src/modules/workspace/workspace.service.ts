import { ForbiddenException, Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import {
  Member,
  MemberRole,
  MemberStatus,
  Workspace,
  WorkspaceType
} from '@prisma/client'
import * as crypto from 'crypto-js'
import { Server } from 'socket.io'
import { Errors } from 'src/libs/errors'
import { PrismaService } from '../prisma/prisma.service'
import { RedisService } from '../redis/redis.service'
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
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService
  ) {}

  //#region Workspace
  async updateWorkspace({
    workspaceId,
    userId,
    workspace
  }: {
    userId: string
    workspaceId: string
    workspace: Workspace
  }) {
    const workspaceUpdated = await this.prismaService.workspace.update({
      where: {
        id: workspaceId,
        isAvailable: true,
        members: {
          some: {
            userId: userId,
            status: MemberStatus.Active,
            role: MemberRole.Admin
          }
        }
      },
      data: {
        ...workspace,
        modifiedById: userId
      },
      include: {
        thumbnail: true,
        avatar: true
      }
    })

    this.server
      .to(workspaceId)
      .emit('workspace', { workspace: workspaceUpdated, action: 'update' })

    return workspaceUpdated
  }

  async deleteWorkspace({
    workpsaceId,
    userId
  }: {
    userId: string
    workpsaceId: string
  }) {
    const memberOperator = await this.prismaService.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workpsaceId
        },
        status: MemberStatus.Active,
        role: MemberRole.Admin
      }
    })

    if (!memberOperator) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    const workspacesDeleted = await this.prismaService.workspace.updateMany({
      where: {
        OR: [
          {
            id: workpsaceId,
            isAvailable: true
          },
          {
            workspaceParent: {
              id: workpsaceId,
              isAvailable: true
            }
          }
        ]
      },
      data: {
        isAvailable: false,
        modifiedById: userId
      }
    })

    return workspacesDeleted
  }

  async getAllWorkspace({ userId }: { userId: string }) {
    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        members: {
          some: {
            userId: userId,
            status: MemberStatus.Active
          }
        },
        isAvailable: true
      },
      include: {
        avatar: true,
        members: {
          where: {
            workspace: {
              type: WorkspaceType.Direct
            }
          },
          include: {
            user: {
              include: {
                avatar: true
              }
            }
          }
        }
      }
    })

    return workspaces
  }

  async getWorkspaceById({
    workspaceId,
    userId
  }: {
    userId: string
    workspaceId: string
  }) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: {
        id: workspaceId,
        isAvailable: true,
        members: {
          some: {
            userId,
            status: MemberStatus.Active
          }
        }
      },
      include: {
        thumbnail: true,
        avatar: true,
        members: {
          include: {
            user: {
              include: {
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!workspace) {
      throw new ForbiddenException({
        code: Errors.PERMISSION_DENIED
      })
    }

    const usersPresence = await this.redisService.getUsersPresence(
      workspace.members.map(member => member.userId)
    )

    return {
      workspace,
      usersPresence
    }
  }

  async getWorkspaceAttachFiles({
    workspaceId,
    userId
  }: {
    workspaceId: string
    userId: string
  }) {
    await this.prismaService.member.findUniqueOrThrow({
      where: {
        userId_workspaceId: {
          userId: userId,
          workspaceId: workspaceId
        },
        workspace: {
          id: workspaceId,
          isAvailable: true
        },
        status: MemberStatus.Active
      }
    })

    const attachmemnts = await Promise.all([
      this.prismaService.cardAttachment.findMany({
        where: {
          card: {
            workspaceId: workspaceId
          }
        },
        include: {
          file: true
        }
      }),
      this.prismaService.messageAttachment.findMany({
        where: {
          message: {
            workspaceId: workspaceId
          }
        },
        include: {
          file: true
        }
      })
    ])
    return attachmemnts.flat()
  }

  //#endregion
}
