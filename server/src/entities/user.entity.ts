import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { File } from './file.entity'
import { Member } from './member.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string

  @Column({ nullable: true })
  firebaseId?: string

  @Column({ unique: true, nullable: false })
  userName: string

  @Column({ unique: true, nullable: false })
  email: string

  @Column({ nullable: true })
  nickName?: string

  @Column({ nullable: true })
  password?: string

  @CreateDateColumn({ nullable: false })
  createdAt: Date

  @UpdateDateColumn({ nullable: false })
  updatedAt: Date

  @Column({ default: true, nullable: false })
  isAvailable: boolean

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'avatarId' })
  avatar?: File

  @OneToMany(() => Member, member => member.user, { nullable: true })
  members?: Member[]
}
