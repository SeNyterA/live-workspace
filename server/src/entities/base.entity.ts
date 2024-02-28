import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  @Exclude()
  createdBy: User
  @RelationId((baseEntity: BaseEntity) => baseEntity.createdBy)
  createdById: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modifiedById' })
  @Exclude()
  modifiedBy: User
  @RelationId((baseEntity: BaseEntity) => baseEntity.modifiedBy)
  modifiedById: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ default: true })
  isAvailable: boolean
}
