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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User
  @RelationId((baseEntity: BaseEntity) => baseEntity.createdBy)
  createdById?: string

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'modifiedById' })
  modifiedBy?: User
  @RelationId((baseEntity: BaseEntity) => baseEntity.modifiedBy)
  modifiedById?: string

  @CreateDateColumn({ nullable: false })
  createdAt: Date

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date

  @Column({ default: true, nullable: false })
  isAvailable: boolean
}
