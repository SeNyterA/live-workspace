import { Injectable } from '@nestjs/common'

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import {
  MemberRole,
  MemberStatus,
  Workspace,
  WorkspaceType
} from '@prisma/client'
import { Server } from 'socket.io'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { TJwtUser } from 'src/modules/socket/socket.gateway'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class DirectService {
  @WebSocketServer()
  server: Server
  constructor(private readonly prismaService: PrismaService) {}

  async createDirect({
    userId,
    workspace,
    userTargetId
  }: {
    workspace: Workspace
    userId: string
    userTargetId: string
  }) {
    const oldDirect = await this.prismaService.workspace.findFirst({
      where: {
        type: WorkspaceType.Direct,
        members: {
          every: {
            userId: {
              in: [userId, userTargetId]
            }
          }
        }
      },
      include: {
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

    if (oldDirect) {
      return oldDirect
    }

    const newDirect = await this.prismaService.workspace.create({
      data: {
        ...workspace,
        type: WorkspaceType.Direct,
        members: {
          create: [
            {
              userId: userId,
              role: MemberRole.Admin,
              status: MemberStatus.Active,
              createdById: userId
            },
            {
              userId: userTargetId,
              role: MemberRole.Admin,
              status: MemberStatus.Active,
              createdById: userId
            }
          ]
        }
      },
      include: {
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

    return newDirect
  }
}
