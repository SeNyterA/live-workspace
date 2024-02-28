import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign } from 'lodash'
import { TCard, TOption, TProperty } from '../../new-types/board'
import { TMember } from '../../new-types/member.d'
import { TMessage } from '../../new-types/message'
import { TUser } from '../../new-types/user'
import { TWorkspace } from '../../new-types/workspace'

export type TUsers = { [userId: string]: TUser }
export type TMembers = { [membersId: string]: TMember }
export type TMessages = {
  [messageId: string]: TMessage
}
export type TUnreadCounts = { [targetId: string]: number }
export type TUserReadedMessages = {
  [key: string]: string //targetId:userId:messageId
}
export type TCards = { [cardId: string]: TCard }
export type TProperties = { [propertyId: string]: TProperty }
export type TpropertiesTracking = { [boardId: string]: string }
export type TWorkspaces = { [cardId: string]: TWorkspace }
export type TOptions = { [optionId: string]: TOption }

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
  propertiesTracking: TpropertiesTracking
  workspaceSettingId?: string
  settingPosition?: 'left' | 'right'
}

const initialState: TWorkpsaceStore = {
  workspaces: {},
  members: {},
  messages: {},
  users: {},
  userReadedMessages: {},
  unreadCount: {},
  cards: {},
  properties: {},
  options: {},
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
