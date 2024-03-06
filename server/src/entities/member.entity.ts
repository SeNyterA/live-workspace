import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
import { BaseEntity } from './base.entity'
import { User } from './user.entity'
import { Workspace } from './workspace.entity'

export enum EMemberRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member'
}

export const RoleWeights: { [role in EMemberRole]: number } = {
  [EMemberRole.Member]: 1,
  [EMemberRole.Admin]: 10,
  [EMemberRole.Owner]: 100
}

export enum EMemberStatus {
  Invited = 'Invited',
  Declined = 'Declined',
  Active = 'Active',
  Left = 'Left',
  Kicked = 'Kicked'
}

@Entity()
export class Member extends BaseEntity {
  @Column({
    type: 'enum',
    enum: EMemberRole,
    default: EMemberRole.Member,
    nullable: false
  })
  role: EMemberRole

  @Column({
    type: 'enum',
    enum: EMemberStatus,
    default: EMemberStatus.Invited,
    nullable: false
  })
  status: EMemberStatus

  @Column({ type: 'boolean', default: false })
  isInvited: boolean

  @Column({ type: 'float', default: 0, nullable: true })
  order?: number

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User
  @RelationId((member: Member) => member.user)
  userId: string

  @ManyToOne(() => Workspace, { nullable: false })
  @JoinColumn({ name: 'targetId' })
  workspace: Workspace
  @RelationId((member: Member) => member.workspace)
  targetId: string
}
