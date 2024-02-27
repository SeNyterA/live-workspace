import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import {
  Workspace,
  WorkspaceStatus,
  WorkspaceType
} from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { In, Not, Repository } from 'typeorm'
import { generateRandomHash } from '../../workspace.service'

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
    @InjectRepository(Workspace)
    private readonly teamRepository: Repository<Workspace>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  async createChannel({
    user,
    workspace,
    teamId
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        workspace: { _id: teamId },
        user: { _id: user.sub },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    const newWorkspace = await this.teamRepository.insert({
      ...workspace,
      type: WorkspaceType.Channel,
      displayUrl: generateRandomHash(),
      status: WorkspaceStatus.Public,
      createdBy: { _id: user.sub },
      modifiedBy: { _id: user.sub },
      parent: { _id: teamId }
    })

    const workpsaceMembers =
      newWorkspace.generatedMaps[0].status === WorkspaceStatus.Public
        ? await this.memberRepository.find({
            where: {
              workspace: { _id: teamId },
              isAvailable: true,
              user: { _id: Not(user.sub), isAvailable: true }
            }
          })
        : []

    const members = await this.memberRepository.insert([
      {
        role: EMemberRole.Owner,
        type: EMemberType.Channel,
        user: { _id: user.sub },
        workspace: { _id: newWorkspace.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      },
      ...workpsaceMembers.map(member => ({
        role: EMemberRole.Member,
        type: EMemberType.Channel,
        user: { _id: member.userId },
        workspace: { _id: newWorkspace.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      }))
    ])

    return {
      workspace: newWorkspace,
      members
    }
  }
}
