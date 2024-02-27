import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import {
  Workspace,
  WorkspaceStatus,
  WorkspaceType
} from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { In, Not, Repository } from 'typeorm'
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
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @Inject(forwardRef(() => BoardService))
    readonly boardService: BoardService,

    @Inject(forwardRef(() => ChannelService))
    readonly channelService: ChannelService
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
    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Team,
        displayUrl: generateRandomHash(),
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      })
    )

    // const users = await this.userRepository.find({
    //   take: 99
    // })

    // const _member = await this.memberRepository.insert([
    //   {
    //     role: EMemberRole.Owner,
    //     type: EMemberType.Team,
    //     modifiedBy: { _id: user.sub },
    //     createdBy: { _id: user.sub },
    //     user: { _id: user.sub },
    //     workspace: newWorkspace
    //   },
    //   ...users.map(e => ({
    //     user: { _id: e._id },
    //     role: EMemberRole.Member,
    //     type: EMemberType.Team,
    //     modifiedBy: { _id: user.sub },
    //     createdBy: { _id: user.sub },
    //     workspace: newWorkspace
    //   }))
    // ])

    const _member = await this.memberRepository.insert([
      {
        user: { _id: user.sub },
        role: EMemberRole.Owner,
        type: EMemberType.Team,
        modifiedBy: { _id: user.sub },
        createdBy: { _id: user.sub },
        workspace: newWorkspace
      },
      ...members
        ?.filter(e => e.userId !== user.sub)
        ?.map(e => ({
          user: { _id: e.userId },
          role: e.role,
          type: EMemberType.Team,
          modifiedBy: { _id: user.sub },
          createdBy: { _id: user.sub },
          workspace: newWorkspace
        }))
    ])

    const team = await this.workspaceRepository.findOneOrFail({
      where: { _id: newWorkspace._id },
      relations: ['avatar', 'thumbnail']
    })
    this.server
      .to([team._id, ..._member.identifiers.map(e => e._id)])
      .emit('workspace', { workspace: team })

    boards?.map(boardInfo =>
      this.boardService.createBoard({
        user,
        workspace: {
          ...boardInfo,
          parent: { _id: newWorkspace._id } as Workspace,
          type: WorkspaceType.Board,
          displayUrl: generateRandomHash(),
          createdBy: { _id: user.sub },
          modifiedBy: { _id: user.sub }
        } as Workspace,
        teamId: newWorkspace._id
      })
    )

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

  async createChildWorkspace({
    user,
    workspace,
    teamId,
    type
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
    type: WorkspaceType.Board | WorkspaceType.Channel
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        workspace: { _id: teamId, isAvailable: true },
        user: { _id: user.sub, isAvailable: true },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    const newWorkspace = await this.workspaceRepository.insert({
      ...workspace,
      type: type,
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
        type:
          type === WorkspaceType.Board
            ? EMemberType.Board
            : EMemberType.Channel,
        user: { _id: user.sub },
        workspace: { _id: newWorkspace.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      },
      ...workpsaceMembers.map(member => ({
        role: EMemberRole.Member,
        type:
          type === WorkspaceType.Board
            ? EMemberType.Board
            : EMemberType.Channel,
        user: { _id: member.userId },
        workspace: { _id: newWorkspace.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      }))
    ])

    return newWorkspace
  }
}
