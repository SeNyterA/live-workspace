import { Injectable } from '@nestjs/common'

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

import {
  Member,
  MemberRole,
  MemberStatus,
  MessageType,
  Workspace,
  WorkspaceStatus,
  WorkspaceType
} from '@prisma/client'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { TJwtUser } from 'src/modules/socket/socket.gateway'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class GroupService {
  @WebSocketServer()
  server: Server
  constructor(private readonly prismaService: PrismaService) {}

  async createGroup({
    user,
    workspace,
    members
  }: {
    workspace: Workspace
    user: TJwtUser
    members?: Member[]
  }) {
    const newGroup = await this.prismaService.workspace.create({
      data: {
        ...workspace,
        type: WorkspaceType.Group,
        status: WorkspaceStatus.Private,
        createdById: user.sub,
        modifiedById: user.sub,

        members: {
          createMany: {
            data: [
              {
                userId: user.sub,
                role: MemberRole.Admin,
                status: MemberStatus.Active
              },
              ...(members
                .filter(e => e.userId !== user.sub)
                .map(e => ({
                  userId: e.userId,
                  role: MemberRole.Member,
                  status: MemberStatus.Invited
                })) || [])
            ],
            skipDuplicates: true
          }
        },

        messages: {
          createMany: {
            data: [
              {
                content: {
                  type: 'doc',
                  content: [
                    {
                      type: 'heading',
                      attrs: {
                        textAlign: 'left',
                        level: 2
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Welcome to group'
                        }
                      ]
                    }
                  ]
                },
                type: MessageType.System
              }
            ]
          }
        }
      }
    })

    return newGroup
  }
}
