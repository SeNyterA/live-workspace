import { Injectable, NotFoundException } from '@nestjs/common'

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Workspace } from '@prisma/client'
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
    user,
    workspace,
    userTargetId
  }: {
    workspace: Workspace
    user: TJwtUser
    userTargetId: string
  }) {
    // const direct = (
    //   await this.workspaceRepository.find({
    //     where: {
    //       type: WorkspaceType.Direct,
    //       isAvailable: true,
    //       members: {
    //         user: { id: In([userTargetId, user.sub]), isAvailable: true },
    //         isAvailable: true
    //       }
    //     },
    //     relations: ['members', 'members.user']
    //   })
    // ).find(
    //   workspace =>
    //     workspace.members.length === 2 &&
    //     workspace.members.every(member =>
    //       [user.sub, userTargetId].includes(member.id)
    //     )
    // )
    // if (direct) return { direct }
    // const users = await this.userRepository.find({
    //   where: {
    //     isAvailable: true,
    //     id: In([user.sub, userTargetId])
    //   }
    // })
    // if (users.length !== 2) throw new NotFoundException()
    // const newDirect = this.workspaceRepository.insert({
    //   ...workspace,
    //   type: WorkspaceType.Direct,
    //   createdBy: { id: user.sub },
    //   members: users.map(_user => ({
    //     user: _user,
    //     createdBy: { id: user.sub }
    //   }))
    // })
  }
}
