import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { EMemberStatus, Member } from 'src/entities/member.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { Repository } from 'typeorm'
@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class MemberService {
  @WebSocketServer()
  server: Server
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>
  ) {}
  async getInvitions({ user }: { user: TJwtUser }) {
    const invitions = await this.memberRepository.find({
      where: {
        user: { _id: user.sub, isAvailable: true },
        status: EMemberStatus.Invited,
        isAvailable: true
      },
      relations: [
        'workspace',
        'createdBy',
        'workspace.avatar',
        'workspace.thumbnail',
        'createdBy.avatar'
      ]
    })

    return {
      invitions
    }
  }

  async acceptInvition({
    user,
    memberId
  }: {
    user: TJwtUser
    memberId: string
  }) {
    await this.memberRepository.update(
      {
        _id: memberId,
        user: { _id: user.sub, isAvailable: true },
        status: EMemberStatus.Invited,
        isAvailable: true
      },
      {
        status: EMemberStatus.Active,
        modifiedBy: { _id: user.sub }
      }
    )
  }

  async declineInvition({
    user,
    memberId
  }: {
    user: TJwtUser
    memberId: string
  }) {
    const _memberDeclined = await this.memberRepository.update(
      {
        _id: memberId,
        user: { _id: user.sub, isAvailable: true },
        status: EMemberStatus.Invited,
        isAvailable: true
      },
      {
        status: EMemberStatus.Declined,
        modifiedBy: { _id: user.sub }
      }
    )

    return _memberDeclined
  }
}
