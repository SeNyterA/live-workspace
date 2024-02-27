import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { Repository } from 'typeorm'
import { generateRandomHash } from '../workspace.service'
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly teamRepository: Repository<Workspace>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    readonly boardService: BoardService,
    readonly channelService: ChannelService
  ) {}

  async createTeam({
    user,
    workspace,
    boards,
    channels
  }: {
    user: TJwtUser
    workspace: Workspace
    channels?: Workspace[]
    boards?: Workspace[]
  }) {
    const newWorkspace = await this.teamRepository.save(
      this.teamRepository.create({
        ...workspace,
        type: WorkspaceType.Team,
        displayUrl: generateRandomHash(),
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      })
    )

    const users = await this.userRepository.find({
      take: 99
    })

    const _member = await this.memberRepository.insert([
      {
        role: EMemberRole.Owner,
        type: EMemberType.Team,
        modifiedBy: { _id: user.sub },
        createdBy: { _id: user.sub },
        user: { _id: user.sub },
        workspace: newWorkspace
      },
      ...users.map(e => ({
        user: { _id: e._id },
        role: EMemberRole.Member,
        type: EMemberType.Team,
        modifiedBy: { _id: user.sub },
        createdBy: { _id: user.sub },
        workspace: newWorkspace
      }))
    ])
    const team = await this.teamRepository.findOneOrFail({
      where: { _id: newWorkspace._id },
      relations: ['avatar', 'thumbnail']
    })
    this.server
      .to([team._id, ..._member.identifiers.map(e => e._id)])
      .emit('workspace', { workspace: team })

    await this.boardService.createBoard({
      teamId: newWorkspace._id,
      user,
      workspace: {
        title: 'Main Board',
        description: 'Main board for team',
        parent: { _id: newWorkspace._id } as Workspace,
        type: WorkspaceType.Board,
        displayUrl: generateRandomHash(),
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      } as Workspace
    })

    channels?.map(channelInfo =>
      this.channelService.createChannel({
        user,
        workspace: {
          ...channelInfo,
          parent: { _id: newWorkspace._id } as Workspace,
          type: WorkspaceType.Channel,
          displayUrl: generateRandomHash(),
          createdBy: { _id: user.sub },
          modifiedBy: { _id: user.sub }
        } as Workspace,
        teamId: newWorkspace._id
      })
    )

    return {
      team
    }
  }
}
