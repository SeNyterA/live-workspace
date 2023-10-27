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

export const useAppSelector = <T>(
  selector: (state: RootState) => T,
  defaultValue?: T
): T | undefined => {
  try {
    const value = useSelector(selector)
    return value || defaultValue
  } catch (error) {
    console.log('_useSelector error', error)
    return defaultValue
  }
}
