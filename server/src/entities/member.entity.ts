import { Exclude } from 'class-transformer'
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
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

  @Column({ type: 'float', default: 0 })
  order: number

  @ManyToOne(() => User, {})
  @JoinColumn({ name: 'userId' })
  @Exclude()
  user: User
  @RelationId((member: Member) => member.user)
  userId: string

  @ManyToOne(() => Workspace, {})
  @JoinColumn({ name: 'targetId' })
  @Exclude()
  workspace: Workspace
  @RelationId((member: Member) => member.workspace)
  targetId: string
}
