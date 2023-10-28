import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign } from 'lodash'
import {
  TChannel,
  TGroup,
  TMember,
  TMessage,
  TTeam
} from '../../types/workspace.type'

type TWorkpsaceStore = {
  teams: { [teamId: string]: TTeam }
  channels: { [channelId: string]: TChannel }
  groups: { [groupId: string]: TGroup }
  members: { [membersId: string]: TMember }
  messages: {
    [messageId: string]: TMessage
  }
}

const initialState: TWorkpsaceStore = {
  channels: {},
  groups: {},
  teams: {},
  members: {},
  messages: {}
}

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      assign(state, action.payload)
    },
    addMembers: (
      state,
      action: PayloadAction<{ [membersId: string]: TMember }>
    ) => {
      assign(state.members, action.payload)
    },
    addMessages: (
      state,
      action: PayloadAction<{ [messageId: string]: TMessage }>
    ) => {
      assign(state.messages, action.payload)
    }
  }
})

export const workspaceActions = workspaceSlice.actions

export default workspaceSlice.reducer
