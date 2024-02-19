import { EFieldType } from '../services/apis/board/board.api'

export enum EMemberRole {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member'
}

export enum EMemberType {
  Workspace = 'Workspace',
  Team = 'Team',
  Channel = 'Channel',
  Board = 'Board',
  Group = 'Group',
  DirectMessage = 'DirectMessage'
}

export type TWorkspacePlayload = {
  title: string
  description?: string
  avatar?: string
}

export type TChannelPayload = TWorkspacePlayload

export type TWorkspace = {
  _id: string
  title: string
  description?: string
  avatar?: string
  createdById: string
  modifiedById: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
}

export type TTeam = TWorkspace

export type TBoard = {
  teamId: string
} & TWorkspace

export type TChannel = {
  teamId: string
} & TWorkspace

export type TGroup = TWorkspace
export type TDirect = {
  userIds: string[]
} & TWorkspace

export type TMember = {
  _id: string
  userId: string
  targetId: string
  role: EMemberRole
  type: EMemberType
  path: string
  createdById: string
  modifiedById: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
}

export enum EMessageFor {
  Channel = 'Channel',
  Group = 'Group',
  Direct = 'Direct'
}

export enum EMessageType {
  Normal = 'Normal',
  System = 'System'
}

export type TMessage = TWorkspace & {
  content: JSONContent
  messageReferenceId: string
  messageFor: EMessageFor
  messageType: EMessageType
  attachments?: string[]
  replyRootId?: string
  replyToMessageId?: string
  reactions: { [userId: string]: any }
}

export type TOption = {
  _id: string
  title: string
  color: string
}
export type TProperty = TWorkspace & {
  boardId: string
  fieldType: EFieldType
  fieldOption?: TOption[]
}

export enum EBlockType {
  Divider = 'Divider',
  Text = 'Text',
  Checkbox = 'Checkbox',
  Image = 'Image',
  Files = 'Files'
}

export type TBlock = {
  _id: string
  blockType: EBlockType
  content?: string
  isCheck?: boolean
  files?: string[]
}

export type TCardProperties = {
  [propertyId: string]: string | string[] | undefined
}

export declare type JSONContent = {
  type?: string
  attrs?: Record<string, any>
  content?: JSONContent[]
  marks?: {
    type: string
    attrs?: Record<string, any>
    [key: string]: any
  }[]
  text?: string
  [key: string]: any
}

export type TCard = TWorkspace & {
  boardId: string
  data?: JSONContent
  blocks: TBlock[]
  properties?: TCardProperties
}
