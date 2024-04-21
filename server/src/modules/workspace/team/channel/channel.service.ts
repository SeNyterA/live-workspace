import {
  ForbiddenException,
  Inject,
  Injectable,
  forwardRef
} from '@nestjs/common'

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import {
  Member,
  MemberRole,
  MemberStatus,
  MessageType,
  Workspace,
  WorkspaceType
} from '@prisma/client'
import { Server } from 'socket.io'

import { Errors } from 'src/libs/errors'
import { membersJoinRoomWhenCreateWorkspace } from 'src/libs/helper'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { TeamService } from '../team.service'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class ChannelService {
  @WebSocketServer()
  server: Server
  constructor(
    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService,
    private readonly prismaService: PrismaService
  ) {}

  async createChannel({
    userId,
    workspace,
    teamId,
    members
  }: {
    workspace: Workspace
    userId: string
    teamId: string
    members?: Member[]
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: userId,
        workspaceId: teamId,
        status: MemberStatus.Active,
        role: MemberRole.Admin
      }
    })

    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const channel = await this.prismaService.workspace.create({
      data: {
        ...workspace,
        workspaceParentId: teamId,
        type: WorkspaceType.Channel,
        createdById: userId,
        modifiedById: userId,
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
                        level: 4
                      },
                      content: [
                        {
                          type: 'text',
                          text: 'Welcome to channel'
                        }
                      ]
                    }
                  ]
                },
                type: MessageType.System
              }
            ]
          }
        },

        members: {
          createMany: {
            data: [
              {
                role: MemberRole.Admin,
                userId: userId,
                status: MemberStatus.Active
              }
            ]
          }
        }
      },
      include: {
        avatar: true
      }
    })

    membersJoinRoomWhenCreateWorkspace({
      workspaceId: channel.id,
      workspace: channel,
      prismaService: this.prismaService,
      server: this.server
    })

    return channel
  }
}
