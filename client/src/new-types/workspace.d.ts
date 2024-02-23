
import { TBase } from './base'
import { TProperty } from './board'
import { TMember } from './member'
import { TMessage } from './message'

export enum WorkspaceType {
  Channel = 'Channel',
  Board = 'Board',
  Group = 'Group',
  DirectMessage = 'DirectMessage',
  Team = 'Team'
}

export type TWorkspace = TBase & {
  title: string
  description: string
  avatar: string
  displayUrl: string
  type: WorkspaceType
  parent: Workspace
  parentId: string

  members?: TMember[]
  messages?: TMessage[]
  properties?: TProperty[]

  cards?: TCard[]
}
