import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TUser } from '../../types/user.type'
import { lsActions } from '../../utils/auth'

interface UserState {
  userInfo: TUser | null
  isAuthenticated: boolean | null
  token: string | null
}

const initialState: UserState = {
  userInfo: lsActions.getUser(),
  isAuthenticated: !!lsActions.getToken(),
  token: lsActions.getToken()
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: () => initialState,
    loginSuccess: (
      state,
      action: PayloadAction<{ user: TUser; token: string }>
    ) => {
      state.isAuthenticated = true
      state.userInfo = action.payload.user
      state.token = action.payload.token

      lsActions.setToken(action.payload.token)
      lsActions.setUser(action.payload.user)
    },
    loginFailure: state => {
      state.isAuthenticated = false
      lsActions.clearLS()
    },
    loadSuccess: (state, action: PayloadAction<{ user: TUser }>) => {
      state.isAuthenticated = true
      state.userInfo = action.payload.user
      state.token = lsActions.getToken()
    },
    logout: state => {
      state.isAuthenticated = false
      state.userInfo = null
      state.token = null
      lsActions.clearLS()
    }
  }
})

export const authActions = authSlice.actions

export default authSlice.reducer
