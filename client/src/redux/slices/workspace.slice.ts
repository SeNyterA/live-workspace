import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { assign } from 'lodash'
import { TCardData } from '../../services/apis/board/board.api'
import { TUser } from '../../types/user.type'
import {
  TBoard,
  TCard,
  TChannel,
  TDirect,
  TGroup,
  TMember,
  TMessage,
  TOption,
  TProperty,
  TTeam
} from '../../types/workspace.type'

export type TUsers = { [userId: string]: TUser }
export type TMembers = { [membersId: string]: TMember }
export type TChannels = { [channelId: string]: TChannel }
export type TBoards = { [boardId: string]: TBoard }
export type TGroups = { [groupId: string]: TGroup }
export type TTeams = { [teamId: string]: TTeam }
export type TDirects = { [directId: string]: TDirect }
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

type TWorkpsaceStore = {
  teams: TTeams
  channels: TChannels
  groups: TGroups
  directs: TDirects
  members: TMembers
  users: TUsers
  messages: TMessages
  userReadedMessages: TUserReadedMessages
  unreadCount: TUnreadCounts

  boards: TBoards
  cards: TCards
  properties: TProperties
  propertiesTracking: TpropertiesTracking
}

const initialState: TWorkpsaceStore = {
  channels: {},
  groups: {},
  teams: {},
  members: {},
  messages: {},
  users: {},
  directs: {},
  userReadedMessages: {},
  unreadCount: {},

  boards: {},
  cards: {},
  properties: {},
  propertiesTracking: {}
}
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    init: (state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      return assign(state, action.payload)
    },

    updateData: (state, action: PayloadAction<Partial<TWorkpsaceStore>>) => {
      const {
        channels,
        directs,
        groups,
        members,
        messages,
        teams,
        users,
        boards,
        cards,
        properties
      } = action.payload
      if (channels) assign(state.channels, channels)
      if (directs) assign(state.directs, directs)
      if (groups) assign(state.groups, groups)
      if (members) assign(state.members, members)
      if (messages) assign(state.messages, messages)
      if (teams) assign(state.teams, teams)
      if (users) assign(state.users, users)

      if (boards) assign(state.boards, boards)
      if (cards) assign(state.cards, cards)
      if (properties) assign(state.properties, properties)
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

    //Board
    addBoards: (state, action: PayloadAction<TBoards>) => {
      assign(state.boards, action.payload)
    },
    addCards: (state, action: PayloadAction<TCards>) => {
      assign(state.cards, action.payload)
    },
    updateCardData: (
      state,
      action: PayloadAction<{
        cardId: string
        data: TCardData
      }>
    ) => {
      const card = state.cards[action.payload.cardId]
      if (!card) return
      assign(card.data, action.payload.data)
    },
    addProperties: (state, action: PayloadAction<TProperties>) => {
      assign(state.properties, action.payload)
    },
    updatePropertyOptions: (
      state,
      action: PayloadAction<{
        propertyId: string
        fieldOption: TOption[]
      }>
    ) => {
      const property = state.properties[action.payload.propertyId]
      if (!property) return
      property.fieldOption = action.payload.fieldOption
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
    },
    setUnreadCounts: (state, action: PayloadAction<TUnreadCounts>) => {
      assign(state.unreadCount, action.payload)
    },
    setPropertiesTracking: (
      state,
      action: PayloadAction<TpropertiesTracking>
    ) => {
      assign(state.propertiesTracking, action.payload)
    }
  }
})

export const workspaceActions = workspaceSlice.actions

export default workspaceSlice.reducer
