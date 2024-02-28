import { User } from 'src/entities/user.entity'

export type TLoginPayload = {
  userNameOrEmail: string
  password: string
}

export type TLoginResponse = {
  user: User
  token: string
}
