import { TUser } from '../types/user'

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
  },

  getTrackingId: (key: string) =>
    localStorage.getItem(key) as string | undefined,
  setTrackingId: (key: string, value: string) =>
    localStorage.setItem(key, value),

  getSortBy: (key: string) => localStorage.getItem(key + '_sortBy'),
  setSortBy: (key: string, value: string) =>
    localStorage.setItem(key + '_sortBy', value)
}
