import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign } from 'lodash'
import {
  TAttachments,
  TCards,
  TFiles,
  TMembers,
  TMessages,
  TOptions,
  TProperties,
  TpropertiesTracking,
  TReactions,
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
  reactions: TReactions
  propertiesTracking: TpropertiesTracking
  workspaceSettingId?: string
  attachments: TAttachments
  settingPosition?: 'left' | 'right'
  presents: { [userId: string]: string }
  typing: {
    [workspaceId: string]: {
      [userId: string]: boolean
    }
  }
}

const initialState: TWorkpsaceStore = {
  workspaces: {},
  files: {},
  members: {},
  messages: {},
  users: {},
  cards: {},
  properties: {},
  reactions: {},
  options: {},
  attachments: {},
  userReadedMessages: {},
  unreadCount: {},
  presents: {},
  propertiesTracking: {},
  typing: {}
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
    },

    toogleTyping: (
      state,
      action: PayloadAction<{
        userId: string
        workpsaceId: string
        isTyping: boolean
      }>
    ) => {
      if (!state.typing[action.payload.workpsaceId])
        state.typing[action.payload.workpsaceId] = {}

      state.typing[action.payload.workpsaceId][action.payload.userId] =
        action.payload.isTyping
    }
  }
})

export const workspaceActions = workspaceSlice.actions

export default workspaceSlice.reducer
