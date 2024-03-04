import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { Card } from './board/card.entity'
import { Message } from './message.entity'

export enum EFileSourceType {
  AWS = 'AWS',
  Link = 'Link'
}
@Entity()
export class File extends BaseEntity {
  @Column({ nullable: false })
  path: string

  @Column({ type: 'float', nullable: true })
  size?: number

  @Column({
    type: 'enum',
    enum: EFileSourceType,
    default: EFileSourceType.AWS,
    nullable: false
  })
  sourceType: EFileSourceType

  @ManyToMany(() => Message, { nullable: true })
  @JoinTable({
    name: 'message_attachment'
  })
  messages?: Message[]

  @ManyToMany(() => Card, { nullable: true })
  @JoinTable({
    name: 'card_attachment'
  })
  cards?: Card[]
}
