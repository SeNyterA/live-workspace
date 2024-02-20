import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
import { BaseEntity } from '../base.entity'
import { Workspace } from '../workspace.entity'

@Entity()
export class Card extends BaseEntity {
  @Column({ default: '' })
  title: string

  @Column({ type: 'json', default: {} })
  properties: {
    [key: string]: string | string[] | undefined
  }

  @Column({ type: 'json', default: {} })
  detail: {
    [key: string]: string | string[] | undefined
  }

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'boardId' })
  board: Workspace
  @RelationId((card: Card) => card.board)
  boardId: string
}
