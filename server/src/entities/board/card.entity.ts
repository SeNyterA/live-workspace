import { JSONContent } from 'src/libs/helper'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  RelationId
} from 'typeorm'
import { BaseEntity } from '../base.entity'
import { File } from '../file.entity'
import { Workspace } from '../workspace.entity'

@Entity()
export class Card extends BaseEntity {
  @Column({ default: '' })
  title: string

  @Column({ type: 'json', nullable: true })
  properties?: {
    [key: string]: string | string[] | undefined
  }

  @Column({ type: 'json', nullable: true })
  detail?: JSONContent

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'thumbnail' })
  thumbnail?: File

  @ManyToMany(() => File, { nullable: true })
  @JoinTable({
    name: 'card_attachment'
  })
  attachments?: File[]

  @ManyToOne(() => Workspace, { nullable: false })
  @JoinColumn({ name: 'boardId' })
  board: Workspace
  @RelationId((card: Card) => card.board)
  boardId: string
}
