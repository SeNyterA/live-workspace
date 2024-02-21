import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { User } from './user.entity'
import { Workspace } from './workspace.entity'

export enum EMemberRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member'
}

export enum EMemberType {
  Team = 'Team',
  Channel = 'Channel',
  Board = 'Board',
  Group = 'Group',
  DirectMessage = 'DirectMessage'
}

@Entity()
export class Member extends BaseEntity {
  @Column({ type: 'enum', enum: EMemberRole, default: EMemberRole.Member })
  role: EMemberRole

  @Column({ type: 'enum', enum: EMemberType })
  type: EMemberType

  @Column()
  path: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  userId: string

  @ManyToOne(() => Workspace)
  @JoinColumn({ name: 'targetId' })
  targetId: string
}
