import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign } from 'lodash'
import { TUser } from '../../types/user.type'
import {
  TChannel,
  TDirect,
  TGroup,
  TMember,
  TMessage,
  TTeam
} from '../../types/workspace.type'

export type TUsers = { [userId: string]: TUser }
export type TMembers = { [membersId: string]: TMember }
export type TChannels = { [channelId: string]: TChannel }
export type TGroups = { [groupId: string]: TGroup }
export type TTeams = { [teamId: string]: TTeam }
export type TDirects = { [directId: string]: TDirect }
export type TMessages = {
  [messageId: string]: TMessage
}
export type TUserReadedMessages = {
  [key: string]: string //targetId:userId:messageId
}

type TWorkpsaceStore = {
  teams: TTeams
  channels: TChannels
  groups: TGroups
  directs: TDirects
  members: TMembers
  users: TUsers
  messages: TMessages
  userReadedMessages: TUserReadedMessages
}

const initialState: TWorkpsaceStore = {
  channels: {},
  groups: {},
  teams: {},
  members: {},
  messages: {},
  users: {},
  directs: {},
  userReadedMessages: {}
}
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      return assign(state, action.payload)
    },

    updateData: (state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      const { channels, directs, groups, members, messages, teams, users } =
        action.payload

      if (channels) assign(state.channels, channels)
      if (directs) assign(state.directs, directs)
      if (groups) assign(state.groups, groups)
      if (members) assign(state.members, members)
      if (messages) assign(state.messages, messages)
      if (teams) assign(state.teams, teams)
      if (users) assign(state.users, users)
    },

    addUsers: (state, action: PayloadAction<TUsers>) => {
      assign(state.users, action.payload)
    },
    addMembers: (state, action: PayloadAction<TMembers>) => {
      assign(state.members, action.payload)
    },

    addTeams: (state, action: PayloadAction<TTeams>) => {
      assign(state.teams, action.payload)
    },
    addChannels: (state, action: PayloadAction<TChannels>) => {
      assign(state.channels, action.payload)
    },
    addGroups: (state, action: PayloadAction<TGroups>) => {
      assign(state.groups, action.payload)
    },
    addDirects: (state, action: PayloadAction<TDirects>) => {
      assign(state.directs, action.payload)
    },

    addMessages: (state, action: PayloadAction<TMessages>) => {
      assign(state.messages, action.payload)
    },
    toogleUserReadedMessage: (
      state,
      action: PayloadAction<{
        userId: string
        targetId: string
        messageId: string
      }>
    ) => {
      const { messageId, targetId, userId } = action.payload
      state.userReadedMessages[`${targetId}_${userId}`] = messageId
    }
  }
})

export const workspaceActions = workspaceSlice.actions

export default workspaceSlice.reducer
