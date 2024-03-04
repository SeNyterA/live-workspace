import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId
} from 'typeorm'
import { BaseEntity } from '../base.entity'
import { Workspace } from '../workspace.entity'
import { Option } from './option.entity'

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
  @Column({ nullable: false })
  title: string

  @Column({ type: 'enum', enum: EFieldType, nullable: false })
  fieldType: EFieldType

  @Column('float', { nullable: true })
  order?: number

  @ManyToOne(() => Workspace, { nullable: false })
  @JoinColumn({ name: 'boardId' })
  board: Workspace
  @RelationId((property: Property) => property.board)
  boardId: string

  @OneToMany(() => Option, option => option.property, { nullable: true })
  options?: Option[]
}
