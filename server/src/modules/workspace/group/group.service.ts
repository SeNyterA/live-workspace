import { Injectable } from '@nestjs/common'

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

import {
  Member,
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
        modifiedById: user.sub
      }
    })

    const _members = await this.prismaService.member.createMany({
      data: members.map(member => ({
        ...member,
        workspaceId: newGroup.id
      }))
    })

    return {
      ...newGroup,
      members: _members
    }
  }
}
