import { TFile } from './file'

export type TUser = {
  _id: string
  firebaseId?: string
  userName: string
  email: string
  nickName?: string
  avatar?: TFile
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
}