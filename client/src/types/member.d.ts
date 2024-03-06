import { TWorkspace } from '.'
import { TBase } from './base'
import { TUser } from './user'

export enum EMemberRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member'
}
export enum EMemberStatus {
  Invited = 'Invited',
  Declined = 'Declined',
  Active = 'Active',
  Left = 'Left',
  Kicked = 'Kicked'
}

export type TMember = TBase & {
  role: EMemberRole
  type: EMemberType
  path: string
  userId: string
  targetId: string
  user?: TUser
  status: EMemberStatus
  workspace?: TWorkspace
}

export const RoleWeights: { [role in EMemberRole]: number } = {
  [EMemberRole.Member]: 1,
  [EMemberRole.Admin]: 10,
  [EMemberRole.Owner]: 100
}
