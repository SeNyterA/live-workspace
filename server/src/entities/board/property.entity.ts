import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
import { BaseEntity } from '../base.entity'
import { Workspace } from '../workspace.entity'

export enum EFieldType {
  Date = 'Date',
  Number = 'Number',
  String = 'String',
  People = 'People',
  MultiPeople = 'MultiPeople',
  Select = 'Select',
  MultiSelect = 'MultiSelect',
  Link = 'Link',
  Email = 'Email',
  Assignees = 'Assignees',
  DueDate = 'DueDate'
}

@Entity()
export class Property extends BaseEntity {
  @Column({ default: '' })
  title: string

  @Column({ type: 'enum', enum: EFieldType })
  fieldType: EFieldType

  @Column()
  order: number

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'boardId' })
  board: Workspace
  @RelationId((property: Property) => property.board)
  boardId: string
}
