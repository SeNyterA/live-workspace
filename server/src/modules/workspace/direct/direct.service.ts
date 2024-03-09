import { Injectable, NotFoundException } from '@nestjs/common'
 
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { In, Repository } from 'typeorm'

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class DirectService {
  @WebSocketServer()
  server: Server
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createDirect({
    user,
    workspace,
    userTargetId
  }: {
    workspace: Workspace
    user: TJwtUser
    userTargetId: string
  }) {
    const direct = (
      await this.workspaceRepository.find({
        where: {
          type: WorkspaceType.Direct,
          isAvailable: true,
          members: {
            user: { _id: In([userTargetId, user.sub]), isAvailable: true },
            isAvailable: true
          }
        },
        relations: ['members', 'members.user']
      })
    ).find(
      workspace =>
        workspace.members.length === 2 &&
        workspace.members.every(member =>
          [user.sub, userTargetId].includes(member._id)
        )
    )

    if (direct) return { direct }

    const users = await this.userRepository.find({
      where: {
        isAvailable: true,
        _id: In([user.sub, userTargetId])
      }
    })

    if (users.length !== 2) throw new NotFoundException()
    const newDirect = this.workspaceRepository.insert({
      ...workspace,
      type: WorkspaceType.Direct,
      createdBy: { _id: user.sub },
      members: users.map(_user => ({
        user: _user,
        createdBy: { _id: user.sub }
      }))
    })
  }
}
