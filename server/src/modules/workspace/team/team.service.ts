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
    userId,
    workspace,
    boards,
    channels,
    members
  }: {
    userId: string
    workspace: Workspace
    channels?: Workspace[]
    boards?: Workspace[]
    members?: Member[]
  }) {
    const team = await this.prismaService.workspace.create({
      data: {
        ...workspace,
        thumbnailId: workspace.thumbnailId,
        avatarId: workspace.avatarId,
        type: WorkspaceType.Team,
        status: WorkspaceStatus.Private,
        createdById: userId,
        modifiedById: userId,
        members: {
          createMany: {
            data: [
              {
                role: MemberRole.Admin,
                userId: userId,
                createdById: userId,
                modifiedById: userId,
                status: MemberStatus.Active
              },
              ...(members?.map(e => ({
                role: e.role,
                userId: e.userId,
                createdById: userId,
                modifiedById: userId,
                status: MemberStatus.Invited
              })) || [])
            ]
          }
        }
      },
      include: {
        members: true,
        avatar: true,
        thumbnail: true
      }
    })

    boards?.forEach(async board => {
      await this.boardService.createBoard({
        userId,
        workspace: board,
        teamId: team.id
      })
    })

    channels?.map(async channel => {
      await this.channelService.createChannel({
        userId,
        workspace: channel,
        teamId: team.id
      })
    })

    const { members: _, ..._team } = team
    this.server
      .to(team.members.map(e => e.userId))
      .emit('workspace', { workspace: _team, action: 'create' })

    return team
  }
}
