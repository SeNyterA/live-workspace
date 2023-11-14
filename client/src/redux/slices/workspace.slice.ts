import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign, cloneDeep } from 'lodash'
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
export type TDirects = { [teamId: string]: TDirect }
export type TMessages = {
  [messageId: string]: TMessage
}

type TWorkpsaceStore = {
  teams: TTeams
  channels: TChannels
  groups: TGroups
  directs: TDirects
  members: TMembers
  users: TUsers
  messages: TMessages
}

const initialState: TWorkpsaceStore = {
  channels: {},
  groups: {},
  teams: {},
  members: {},
  messages: {},
  users: {},
  directs: {}
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      console.log(action.payload)
      return assign(state, action.payload)
    },

    updateData: (_state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      const state = cloneDeep(_state)
      const { channels, directs, groups, members, messages, teams, users } =
        action.payload
      if (channels) assign(state.users, channels)
      if (directs) assign(state.users, directs)
      if (groups) assign(state.users, groups)
      if (members) assign(state.users, members)
      if (messages) assign(state.users, messages)
      if (teams) assign(state.users, teams)
      if (users) assign(state.users, users)
      return state
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
    }
  }
})

export const workspaceActions = workspaceSlice.actions

export default workspaceSlice.reducer
