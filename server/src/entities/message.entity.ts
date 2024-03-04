import { JSONContent } from 'src/libs/helper'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId
} from 'typeorm'
import { BaseEntity } from './base.entity'
import { File } from './file.entity'
import { Workspace } from './workspace.entity'

export enum EMessageType {
  Normal = 'N',
  System = 'S'
}

@Entity()
export class Message extends BaseEntity {
  @Column({
    type: 'enum',
    enum: EMessageType,
    default: EMessageType.Normal,
    nullable: false
  })
  type: EMessageType

  @Column({ type: 'json', nullable: true })
  content?: JSONContent

  @Column({ type: 'json', nullable: true })
  reactions?: {
    [userId: string]: string
  }

  @Column({ type: 'boolean', default: false, nullable: false })
  isPinned: boolean

  @ManyToMany(() => File, { nullable: true })
  @JoinTable({
    name: 'message_attachment'
  })
  attachments?: File[]

  @ManyToOne(() => Workspace, { nullable: false })
  @JoinColumn({ name: 'targetId' })
  target: Workspace
  @RelationId((message: Message) => message.target)
  targetId: string

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'replyToId' })
  replyTo?: Message
  @RelationId((message: Message) => message.replyTo)
  replyToId?: string

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'threadId' })
  thread?: Message
  @RelationId((message: Message) => message.thread)
  threadId?: string
}
