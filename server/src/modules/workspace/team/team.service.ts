import { Inject, Injectable, forwardRef } from '@nestjs/common'

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

import { TJwtUser } from 'src/modules/socket/socket.gateway'

import {
  Member,
  MemberRole,
  MemberStatus,
  Workspace,
  WorkspaceStatus,
  WorkspaceType
} from '@prisma/client'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { BoardService } from './board/board.service'
import { ChannelService } from './channel/channel.service'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class TeamService {
  @WebSocketServer()
  server: Server
  constructor(
    @Inject(forwardRef(() => BoardService))
    readonly boardService: BoardService,

    @Inject(forwardRef(() => ChannelService))
    readonly channelService: ChannelService,

    private readonly prismaService: PrismaService
  ) {}

  async createTeam({
    user,
    workspace,
    boards,
    channels,
    members
  }: {
    user: TJwtUser
    workspace: Workspace
    channels?: Workspace[]
    boards?: Workspace[]
    members?: Member[]
  }) {
    const team = await this.prismaService.workspace.create({
      data: {
        ...workspace,
        type: WorkspaceType.Team,
        status: WorkspaceStatus.Private,
        createdById: user.sub,
        modifiedById: user.sub,
        members: {
          createMany: {
            data: [
              {
                role: MemberRole.Owner,
                userId: user.sub,
                createdById: user.sub,
                modifiedById: user.sub,
                status: MemberStatus.Active
              },
              ...(members?.map(e => ({
                role: e.role,
                userId: e.userId,
                createdById: user.sub,
                modifiedById: user.sub,
                status: MemberStatus.Invited
              })) || [])
            ]
          }
        },
        workspacesChildren: {
          createMany: {
            data: [
              ...(boards || []).map(e => ({
                ...e,
                type: WorkspaceType.Board,
                status: WorkspaceStatus.Private,
                createdById: user.sub,
                modifiedById: user.sub
              })),
              ...(channels || []).map(e => ({
                ...e,
                type: WorkspaceType.Channel,
                status: WorkspaceStatus.Private,
                createdById: user.sub,
                modifiedById: user.sub
              }))
            ]
          }
        }
      }
    })
  }
}
