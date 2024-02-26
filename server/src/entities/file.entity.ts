import { Column, Entity } from 'typeorm'
import { BaseEntity } from './base.entity'

export enum EFileSourceType {
  AWS = 'AWS',
  Link = 'Link'
}
@Entity()
export class File extends BaseEntity {
  @Column()
  path: string

  @Column({ type: 'float' })
  size?: number

  @Column({ type: 'enum', enum: EFileSourceType, default: EFileSourceType.AWS })
  sourceType: EFileSourceType
}
