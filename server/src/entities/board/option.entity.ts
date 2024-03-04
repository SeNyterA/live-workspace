import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
import { BaseEntity } from '../base.entity'
import { Workspace } from '../workspace.entity'
import { Property } from './property.entity'

@Entity()
export class Option extends BaseEntity {
  @Column({ nullable: false })
  title: string

  @Column({ nullable: true })
  color?: string

  @Column('float', { nullable: true })
  order?: number

  @ManyToOne(() => Property, { nullable: false })
  @JoinColumn({ name: 'propertyId' })
  property: Property
  @RelationId((option: Option) => option.property)
  propertyId: string

  @ManyToOne(() => Workspace, { nullable: false })
  @JoinColumn({ name: 'boardId' })
  board: Workspace
  @RelationId((option: Option) => option.board)
  boardId: string
}
