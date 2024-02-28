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

  @Column({ type: 'json' })
  properties: {
    [key: string]: string | string[] | undefined
  }

  @Column({ type: 'json' })
  detail: JSONContent

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'thumbnail' })
  thumbnail?: File

  @ManyToMany(() => File)
  @JoinTable({
    name: 'card_attachment'
  })
  attachments: File[]

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'boardId' })
  board: Workspace

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'boardId' })
  @RelationId((card: Card) => card.board)
  boardId: string
}
