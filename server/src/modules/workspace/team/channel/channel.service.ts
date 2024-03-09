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
  Workspace,
  WorkspaceType
} from '@prisma/client'
import { Server } from 'socket.io'

import { Errors } from 'src/libs/errors'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
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
    user,
    workspace,
    teamId,
    members
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
    members?: Member[]
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: user.sub,
        workspaceId: teamId,
        status: MemberStatus.Active,
        role: {
          in: [MemberRole.Admin, MemberRole.Owner]
        }
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
        createdById: user.sub,
        modifiedById: user.sub,
        members: {
          createMany: {
            data: members.map(member => ({
              userId: member.userId,
              role: member.role,
              status: MemberStatus.Invited
            }))
          }
        }
      }
    })
  }
}
