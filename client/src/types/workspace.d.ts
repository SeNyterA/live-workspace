import { TBase } from './base'
import { TProperty } from './board'
import { TFile } from './file'
import { TMember } from './member'
import { TMessage } from './message'

export enum EWorkspaceType {
  Channel = 'Channel',
  Board = 'Board',
  Group = 'Group',
  Direct = 'Direct',
  Team = 'Team'
}

export enum EWorkspaceStatus {
  Private = 'Private',
  Public = 'Public'
}

export type TWorkspace = TBase & {
  title: string
  description: string
  avatar?: TFile
  thumbnail?: TFile
  displayUrl: string
  type: EWorkspaceType
  parent: Workspace
  parentId: string
  status: EWorkspaceStatus

  members?: TMember[]
  messages?: TMessage[]
  properties?: TProperty[]

  cards?: TCard[]
}
