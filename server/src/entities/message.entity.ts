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

export enum EMesssageFor {
  Channel = 'C',
  Direct = 'D',
  Group = 'G',
  Board = 'B'
}

@Entity()
export class Message extends BaseEntity {
  @Column({ type: 'enum', enum: EMessageType, default: EMessageType.Normal })
  type: EMessageType

  @Column({ type: 'enum', enum: EMesssageFor })
  for: EMesssageFor

  @Column({ type: 'json' })
  content: JSONContent

  @Column({ type: 'json' })
  reactions: {
    [userId: string]: string
  }

  @Column({ type: 'boolean', default: false })
  isPinned: boolean

  @ManyToMany(() => File)
  @JoinTable({
    name: 'message_attachment'
  })
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
