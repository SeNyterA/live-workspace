import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { Repository } from 'typeorm'
import { generateRandomHash } from '../workspace.service'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class GroupService {
  @WebSocketServer()
  server: Server
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}

  async createGroup({
    user,
    workspace,
    members
  }: {
    workspace: Workspace
    user: TJwtUser
    members?: Member[]
  }) {
    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Group,
        displayUrl: generateRandomHash(),
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      })
    )

    const _members = await this.memberRepository.insert([
      {
        role: EMemberRole.Owner,
        type: EMemberType.Group,
        user: { _id: user.sub },
        workspace: { _id: newWorkspace._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      },
      ...(members
        ?.filter(e => e.userId !== user.sub)
        .map(e => ({
          ...e,
          user: { _id: e.userId },
          workspace: { _id: newWorkspace._id },
          createdBy: { _id: user.sub },
          modifiedBy: { _id: user.sub }
        })) || [])
    ])

    const group = await this.workspaceRepository.findOne({
      where: { _id: newWorkspace._id }
    })
    this.server
      .to(_members.identifiers.map(e => e._id))
      .emit('workspace', { workspace: group })

    return {
      group
    }
  }
}
