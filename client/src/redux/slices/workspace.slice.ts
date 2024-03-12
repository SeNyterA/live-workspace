import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TOptions } from 'i18next'
import { assign } from 'lodash'
import {
  TAttachments,
  TCards,
  TFiles,
  TMembers,
  TMessages,
  TProperties,
  TpropertiesTracking,
  TUnreadCounts,
  TUserReadedMessages,
  TUsers,
  TWorkspaces
} from '../../types'

type TWorkpsaceStore = {
  workspaces: TWorkspaces
  members: TMembers
  users: TUsers
  messages: TMessages
  userReadedMessages: TUserReadedMessages
  unreadCount: TUnreadCounts
  cards: TCards
  properties: TProperties
  options: TOptions
  files: TFiles
  propertiesTracking: TpropertiesTracking
  workspaceSettingId?: string
  attachments: TAttachments
  settingPosition?: 'left' | 'right'
}

const initialState: TWorkpsaceStore = {
  workspaces: {},
  files: {},
  members: {},
  messages: {},
  users: {},
  cards: {},
  properties: {},
  options: {},
  attachments: {},
  userReadedMessages: {},
  unreadCount: {},

  propertiesTracking: {}
}
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    reset: () => initialState,

    updateWorkspaceStore: (
      state,
      action: PayloadAction<Partial<Omit<TWorkpsaceStore, 'workspaceSetting'>>>
    ) => {
      Object.keys(action.payload).forEach(key => {
        assign((state as any)[key] as any, (action.payload as any)[key])
      })
    },

    toggleWorkspaceSetting: (
      state,
      action: PayloadAction<{
        workspaceSettingId?: string
        settingPosition?: 'left' | 'right'
      }>
    ) => {
      state.workspaceSettingId = action.payload.workspaceSettingId
      if (action.payload.settingPosition)
        state.settingPosition = action.payload.settingPosition
    }
  }
})

export const workspaceActions = workspaceSlice.actions

export default workspaceSlice.reducer
