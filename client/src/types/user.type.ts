export type TUser = {
  _id: string
  firebaseId?: string
  userName: string
  email: string
  nickName?: string
  avatar?: string
  password: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
}
