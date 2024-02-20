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
export class Option extends BaseEntity {
  @Column()
  title: string

  @Column()
  color: string
}

@Entity()
export class Property extends BaseEntity {
  @Column({ default: '' })
  title: string

  @Column({ type: 'enum', enum: EFieldType })
  fieldType: EFieldType

  @Column()
  order: number

  @OneToMany(() => Option, option => option._id, { cascade: true })
  fieldOption?: Option[]

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'boardId' })
  board: Workspace
  @RelationId((property: Property) => property.board)
  boardId: string
}
