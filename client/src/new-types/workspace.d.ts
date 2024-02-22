import { TBase } from './base'

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
  parentId: string
}
