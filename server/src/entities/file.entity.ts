import { Column, Entity } from 'typeorm'
import { BaseEntity } from './base.entity'

@Entity()
export class File extends BaseEntity {
  @Column()
  path: string

  @Column({ type: 'float' })
  size: number
}
