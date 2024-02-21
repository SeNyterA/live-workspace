import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../base.entity'
import { Property } from './property.entity'

@Entity()
export class Option extends BaseEntity {
  @Column()
  title: string

  @Column()
  color: string

  @ManyToOne(() => Property, property => property.fieldOptions)
  property: Property
}
