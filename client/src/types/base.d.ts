import { TUser } from "."

export type TBase = {
  id: string
  createdById: string
  modifiedById: string
  createdAt: string
  updatedAt: string
  isAvailable: boolean

  createdBy?: TUser
  modifiedBy?: TUser
}
