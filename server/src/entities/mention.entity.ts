import { Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
import { BaseEntity } from './base.entity'
import { Message } from './message.entity'
import { User } from './user.entity'
import { Workspace } from './workspace.entity'

@Entity()
export class Mention extends BaseEntity {
  @ManyToOne(() => Message, { nullable: false })
  @JoinColumn({ name: 'messageId' })
  message: Message
  @RelationId((mention: Mention) => mention.message)
  messageId: string

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'mentionedUserId' })
  mentionedUser: User
  @RelationId((mention: Mention) => mention.mentionedUser)
  mentionedUserId: string

  @ManyToOne(() => Workspace, { nullable: false })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace
  @RelationId((mention: Mention) => mention.workspace)
  workspaceId: string
}
