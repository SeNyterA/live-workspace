import { TUser, TUserExtra } from '../../../types'

export type TAuthApi = {
  muations: {
    updateProfile: {
      url: {
        baseUrl: 'auth/profile'
      }
      method: 'patch'
      response: TUserExtra
      payload: Partial<TUser>
    }
  }
  queries: {}
}
