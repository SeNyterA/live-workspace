import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId
} from 'typeorm'
import { BaseEntity } from './base.entity'
import { Card } from './board/card.entity'
import { Property } from './board/property.entity'
import { File } from './file.entity'
import { Member } from './member.entity'
import { Message } from './message.entity'

export enum WorkspaceType {
  Channel = 'Channel',
  Board = 'Board',
  Group = 'Group',
  Direct = 'DirectMessage',
  Team = 'Team'
}

export enum WorkspaceStatus {
  Private = 'Private',
  Public = 'Public'
}

@Entity()
export class Workspace extends BaseEntity {
  @Column()
  title: string

  @Column()
  description: string

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'avatar' })
  avatar?: File

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'thumbnail' })
  thumbnail?: File

  @Column()
  displayUrl: string

  @Column({ type: 'enum', enum: WorkspaceType, default: WorkspaceType.Team })
  type: WorkspaceType

  @Column({
    type: 'enum',
    enum: WorkspaceStatus,
    default: WorkspaceStatus.Public
  })
  status: WorkspaceStatus

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: Workspace
  @RelationId((workspace: Workspace) => workspace.parent)
  parentId: string

  @OneToMany(() => Member, member => member.workspace)
  members?: Member[]

  @OneToMany(() => Message, message => message.target)
  messages?: Message[]

  @OneToMany(() => Property, property => property.board)
  properties?: Property[]

  @OneToMany(() => Card, card => card.board)
  cards?: Card[]
}
