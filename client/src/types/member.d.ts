import { TBase } from './base'
import { TUser } from './user'

export enum EMemberRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member'
}

export type TMember = TBase & {
  role: EMemberRole
  type: EMemberType
  path: string
  userId: string
  targetId: string
  user?: TUser
}

export const RoleWeights: { [role in EMemberRole]: number } = {
  [EMemberRole.Member]: 1,
  [EMemberRole.Admin]: 10,
  [EMemberRole.Owner]: 100
}
