import { TUser } from '../types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const lsActions = {
  setUser: (user: TUser) => {
    localStorage.setItem('userInfo', JSON.stringify(user))
  },

  getUser: () => {
    const userString = localStorage.getItem('userInfo')
    if (userString) {
      return JSON.parse(userString) as TUser
    }
    return null
  },

  getToken: () => localStorage.getItem('access_token') || '',

  setToken: (access_token: string) =>
    localStorage.setItem('access_token', access_token),

  dispatchClearEvent: () => {},

  clearLS: (dispatchEvent?: boolean) => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('userInfo')

    if (dispatchEvent) {
      const clearLSEvent = new Event('clearLS')
      LocalStorageEventTarget.dispatchEvent(clearLSEvent)
    }
  }
}
