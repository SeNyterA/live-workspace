export enum EStatusType {
  Private = 'private',
  Public = 'public',
  System = 'system'
}

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

export type TChannelPayload = TWorkspacePlayload & {
  channelType: EStatusType
}

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
export type TChannel = {
  teamId: string
  channelType: EStatusType
  path: string
} & TWorkspace

export type TGroup = TWorkspace

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
  content: string
  messageReferenceId: string
  messageFor: EMessageFor
  messageType: EMessageType
  attachments?: string[]
  replyToMessageId?: string
}
