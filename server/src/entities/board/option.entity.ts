import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
import { BaseEntity } from '../base.entity'
import { Workspace } from '../workspace.entity'
import { Property } from './property.entity'

@Entity()
export class Option extends BaseEntity {
  @Column()
  title: string

  @Column()
  color: string

  @Column({ type: 'int' })
  order: number

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'propertyId' })
  property: Property
  @RelationId((option: Option) => option.property)
  propertyId: string

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'boardId' })
  board: Workspace
  @RelationId((option: Option) => option.board)
  boardId: string
}
