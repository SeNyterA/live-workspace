import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import authReducer from './slices/auth.slice'
import workspaceReducer from './slices/workspace.slice'

const rootReducer = combineReducers({
  auth: authReducer,
  workspace: workspaceReducer
})

const store = configureStore({
  reducer: rootReducer
})

export default store

export type RootState = ReturnType<typeof rootReducer>

export const getAppValue = <T>(
  selector: (state: RootState) => T,
  defaultValue?: T
): T | undefined => {
  try {
    const value = selector(store.getState())
    return value || defaultValue
  } catch (error) {
    // console.log('_useSelector error', error)
    return defaultValue
  }
}

export const useAppSelector = <T>(
  selector: (state: RootState) => T
): T | undefined => {
  const value = useSelector(state => {
    try {
      return JSON.stringify(selector(state as RootState))
    } catch (error) {
      return undefined
    }
  })
  return value ? JSON.parse(value) : undefined
}
