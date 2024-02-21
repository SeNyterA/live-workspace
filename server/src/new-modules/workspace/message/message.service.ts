import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Member } from 'src/entities/member.entity'
import { Message } from 'src/entities/message.entity'
import { User } from 'src/entities/user.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { RedisService } from 'src/modules/redis/redis.service'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { Repository } from 'typeorm'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly redisService: RedisService
  ) {}

  async createMessage({
    user,
    targetId,
    message,
    replyToId,
    threadId
  }: {
    message: Message
    user: TJwtUser
    targetId: string
    replyToId?: string
    threadId?: string
  }) {
    this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: targetId }
      }
    })

    return this.messageRepository.save(
      this.messageRepository.create({
        ...message,
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        target: { _id: targetId },
        replyTo: replyToId ? { _id: replyToId } : undefined,
        thread: threadId ? { _id: threadId } : undefined
      })
    )
  }

  async pinMessage({
    user,
    messageId,
    targetId
  }: {
    user: TJwtUser
    messageId: string
    targetId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        user: { _id: user.sub, isAvailable: true },
        workspace: { _id: targetId }
      }
    })
    const message = await this.messageRepository.findOneOrFail({
      where: {
        _id: messageId,
        target: { _id: targetId }
      }
    })
    message.isPinned = !message.isPinned
    return this.messageRepository.save(message)
  }
}
