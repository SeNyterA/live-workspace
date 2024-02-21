import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './user.entity'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  @Exclude()
  createdById: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modifiedById' })
  modifiedById: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ default: true })
  isAvailable: boolean
}
