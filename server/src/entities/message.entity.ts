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
import { JSONContent } from 'src/libs/helper'

export enum EMessageType {
  Normal = 'N',
  System = 'S'
}

@Entity()
export class Message extends BaseEntity {
  @Column({ type: 'enum', enum: EMessageType, default: EMessageType.Normal })
  type: EMessageType

  @Column({ type: 'json' })
  content: JSONContent

  @Column({ type: 'json' })
  reactions: {
    [userId: string]: string
  }

  @Column({ type: 'boolean', default: false })
  isPinned: boolean

  @ManyToMany(() => File)
  @JoinTable()
  attachments: File[]

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'targetId' })
  target: Workspace
  @RelationId((message: Message) => message.target)
  targetId: string

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'replyToId' })
  replyTo?: Message
  @RelationId((message: Message) => message.replyTo)
  replyToId: string

  @ManyToOne(() => Message)
  @JoinColumn({ name: 'threadId' })
  thread?: Message
  @RelationId((message: Message) => message.thread)
  threadId: string
}
