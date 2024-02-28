import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { Repository } from 'typeorm'
import { TeamService } from '../team.service'
import { TJwtUser } from 'src/modules/socket/socket.gateway'

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
    teamId
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
  }) {
    const _channel = await this.teamService.createChildWorkspace({
      user,
      workspace,
      teamId,
      type: WorkspaceType.Channel
    })

    return this.workspaceRepository.findOneOrFail({
      where: { _id: _channel.identifiers[0]._id }
    })
  }
}
