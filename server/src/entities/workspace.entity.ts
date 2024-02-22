import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId
} from 'typeorm'
import { BaseEntity } from './base.entity'
import { Member } from './member.entity'
import { Message } from './message.entity'

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

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: Workspace
  @RelationId((workspace: Workspace) => workspace.parent)
  parentId: string

  @OneToMany(() => Member, member => member.workspace)
  members: Member[]

  @OneToMany(() => Message, message => message.target)
  messages: Message[]
}
