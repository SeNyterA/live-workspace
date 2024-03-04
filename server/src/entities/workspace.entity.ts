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
  Private = 'C',
  Public = 'O'
}

@Entity()
export class Workspace extends BaseEntity {
  @Column({ nullable: false })
  title: string

  @Column({ nullable: true })
  description?: string

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'avatar' })
  avatar?: File

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'thumbnail' })
  thumbnail?: File

  @Column({ nullable: true, unique: true })
  displayUrl?: string

  @Column({
    type: 'enum',
    enum: WorkspaceType,
    default: WorkspaceType.Team,
    nullable: false
  })
  type: WorkspaceType

  @Column({
    type: 'enum',
    enum: WorkspaceStatus,
    default: WorkspaceStatus.Public,
    nullable: false
  })
  status: WorkspaceStatus

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Workspace
  @RelationId((workspace: Workspace) => workspace.parent)
  parentId?: string

  @OneToMany(() => Member, member => member.workspace, { nullable: true })
  members?: Member[]

  @OneToMany(() => Message, message => message.target, { nullable: true })
  messages?: Message[]

  @OneToMany(() => Property, property => property.board, { nullable: true })
  properties?: Property[]

  @OneToMany(() => Card, card => card.board, { nullable: true })
  cards?: Card[]
}
