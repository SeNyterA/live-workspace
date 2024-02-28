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

  @Column({ unique: true })
  userName: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  nickName?: string

  @Column()
  @Exclude()
  password: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column({ default: true })
  isAvailable: boolean

  @OneToOne(() => File)
  @JoinColumn({ name: 'avatarId' })
  avatar: File

  @OneToMany(() => Member, member => member.user)
  members: Member[]
}
