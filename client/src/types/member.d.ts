import { TBase } from './base'
import { TUser } from './user'

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

export type TMember = TBase & {
  role: EMemberRole
  type: EMemberType
  path: string
  userId: string
  targetId: string
  user: TUser
}
