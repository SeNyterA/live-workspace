import { User } from './user.schema'

export type TUser = Pick<
  User,
  | '_id'
  | 'avatar'
  | 'email'
  | 'userName'
  | 'nickname'
  | 'firebaseId'
  | 'createdAt'
  | 'updatedAt'
  | 'isAvailable'
>

export type TCreateUser = Pick<
  User,
  'avatar' | 'email' | 'userName' | 'nickname' | 'password'
>

export type TUpdateUser = Partial<Omit<TCreateUser, 'password'>>
