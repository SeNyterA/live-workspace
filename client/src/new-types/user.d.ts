import { TFile } from './file'

export type TUser = {
  _id: string
  firebaseId?: string
  userName: string
  email: string
  nickname?: string
  avatar?: TFile
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
}
