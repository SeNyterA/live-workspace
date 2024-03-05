import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Member } from 'src/entities/member.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { Repository } from 'typeorm'
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
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService
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
    console.log(members)
    const channel = await this.teamService.createChildWorkspace({
      user,
      workspace,
      teamId,
      type: WorkspaceType.Channel,
      members
    })

    return { channel }
  }
}
