import { ForbiddenException, Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Member, MemberRole, MemberStatus, Workspace } from '@prisma/client'
import * as crypto from 'crypto-js'
import { Server } from 'socket.io'
import { Errors } from 'src/libs/errors'
import { PrismaService } from '../prisma/prisma.service'
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

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class WorkspaceService {
  @WebSocketServer()
  server: Server
  constructor(private readonly prismaService: PrismaService) {}

  //#region Workspace
  async createUsersFakeData() {
    const users = await this.prismaService.user.createMany({
      data: Array(100000)
        .fill(1)
        .map(() => ({
          email:
            generateRandomHash(Math.random().toString(), 10) + '@gmail.com',
          userName: generateRandomHash(Math.random().toString(), 10),
          password: crypto.SHA256('123123').toString(),
          nickName: generateRandomHash(Math.random().toString(), 10),
          isAvailable: true
        })),
      skipDuplicates: true
    })
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
    const workspaceUpdated = await this.prismaService.workspace.update({
      where: {
        id: workspaceId,
        isAvailable: true,
        members: {
          some: {
            userId: user.sub,
            status: MemberStatus.Active,
            role: MemberRole.Admin
          }
        }
      },
      data: {
        ...workspace,
        modifiedById: user.sub
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
    user
  }: {
    user: TJwtUser
    workpsaceId: string
  }) {
    const memberOperator = await this.prismaService.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.sub,
          workspaceId: workpsaceId
        },
        status: MemberStatus.Active
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
        modifiedById: user.sub
      }
    })

    return workspacesDeleted
  }

  async getAllWorkspace({ user }: { user: TJwtUser }) {
    const workspaces = await this.prismaService.workspace.findMany({
      where: {
        members: {
          some: {
            userId: user.sub,
            status: MemberStatus.Active
          }
        },
        isAvailable: true
      },
      include: {
        avatar: true
      }
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
    const { members, ...workspace } =
      await this.prismaService.workspace.findUnique({
        where: {
          id: workspaceId,
          isAvailable: true,
          members: {
            some: {
              userId: user.sub,
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

    return {
      workspace,
      members
    }
  }

  async getWorkspaceAttachFiles({
    workspaceId,
    user
  }: {
    workspaceId: string
    user: TJwtUser
  }) {
    const files = this.prismaService.file.findMany({
      where: {}
    })
  }
  //#endregion
}
