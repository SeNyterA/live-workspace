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
  @Column({ default: '' })
  title: string

  @Column({ default: '' })
  description?: string

  @Column({ default: '' })
  avatar?: string

  @Column({ type: 'enum', enum: WorkspaceType })
  type: WorkspaceType
}
