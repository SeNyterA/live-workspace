import { Column, Entity } from 'typeorm'
import { BaseEntity } from './base.entity'

export enum WorkspaceType {
  Channel = 'Channel',
  Board = 'Board',
  Group = 'Group',
  DirectMessage = 'DirectMessage',
  Team = 'Team'
}

@Entity()
export class Workspace extends BaseEntity {
  @Column()
  title: string

  @Column()
  description: string

  @Column()
  avatar: string

  @Column()
  displayUrl: string

  @Column({ type: 'enum', enum: WorkspaceType, default: WorkspaceType.Team })
  type: WorkspaceType
}
