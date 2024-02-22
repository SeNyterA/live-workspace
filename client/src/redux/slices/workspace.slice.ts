import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign } from 'lodash'
import { TMessage } from '../../new-types/message'
import { TWorkspace } from '../../new-types/workspace'
import { TUser } from '../../types/user.type'
import { TCard, TMember, TProperty } from '../../types/workspace.type'

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

type TWorkpsaceStore = {
  workspaces: TWorkspaces
  members: TMembers
  users: TUsers
  messages: TMessages
  userReadedMessages: TUserReadedMessages
  unreadCount: TUnreadCounts

  cards: TCards
  properties: TProperties
  propertiesTracking: TpropertiesTracking
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
  propertiesTracking: {}
}
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    reset: () => initialState,
    init: (state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      return assign(state, action.payload)
    },

    updateData: (state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      Object.keys(action.payload).forEach(key => {
        assign((state as any)[key] as any, (action.payload as any)[key])
      })
    }

    // addProperties: (state, action: PayloadAction<TProperties>) => {
    //   assign(state.properties, action.payload)
    // },
    // updatePropertyOptions: (
    //   state,
    //   action: PayloadAction<{
    //     propertyId: string
    //     fieldOption: TOption[]
    //   }>
    // ) => {
    //   const property = state.properties[action.payload.propertyId]
    //   if (!property) return
    //   property.fieldOption = action.payload.fieldOption
    // },
    // toogleUserReadedMessage: (
    //   state,
    //   action: PayloadAction<{
    //     userId: string
    //     targetId: string
    //     messageId: string
    //   }>
    // ) => {
    //   const { messageId, targetId, userId } = action.payload
    //   state.userReadedMessages[`${targetId}_${userId}`] = messageId
    // },
    // setUnreadCounts: (state, action: PayloadAction<TUnreadCounts>) => {
    //   assign(state.unreadCount, action.payload)
    // },
    // setPropertiesTracking: (
    //   state,
    //   action: PayloadAction<TpropertiesTracking>
    // ) => {
    //   assign(state.propertiesTracking, action.payload)
    // }
  }
})

export const workspaceActions = workspaceSlice.actions

export default workspaceSlice.reducer
