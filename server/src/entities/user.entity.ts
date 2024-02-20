import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string

  @Column({ nullable: true })
  firebaseId?: string

  @Column({ unique: true })
  userName: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  nickname?: string

  @Column({ nullable: true })
  avatar?: string

  @Column()
  @Exclude()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ default: true })
  isAvailable: boolean
}
