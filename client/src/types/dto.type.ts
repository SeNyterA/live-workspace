import { EMemberRole, EMemberType } from './workspace.type'

export type TMemberDto = {
  userId: string
  type: EMemberType
  role: EMemberRole
}
