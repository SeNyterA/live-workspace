import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { Message } from './message.entity'

export enum EFileSourceType {
  AWS = 'AWS',
  Link = 'Link'
}
@Entity()
export class File extends BaseEntity {
  @Column()
  path: string

  @Column({ type: 'float' })
  size?: number

  @Column({ type: 'enum', enum: EFileSourceType, default: EFileSourceType.AWS })
  sourceType: EFileSourceType

  @ManyToMany(() => Message)
  @JoinTable({
    name: 'message_attachment'
  })
  messages: Message[]
}
