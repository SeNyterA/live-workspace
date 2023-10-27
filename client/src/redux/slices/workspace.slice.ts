import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign } from 'lodash'
import { TChannel, TGroup, TMember, TTeam } from '../../types/workspace.type'

type TWorkpsaceStore = {
  teams: { [teamId: string]: TTeam }
  channels: { [channelId: string]: TChannel }
  groups: { [groupId: string]: TGroup }
  members: { [membersId: string]: TMember }
}

const initialState: TWorkpsaceStore = {
  channels: {},
  groups: {},
  teams: {},
  members: {}
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
    }
  }
})

export const workspaceActions = workspaceSlice.actions

export default workspaceSlice.reducer
