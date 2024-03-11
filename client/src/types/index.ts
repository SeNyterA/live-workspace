export enum EFileSourceType {
  AWS = 'AWS',
  Link = 'Link'
}

export enum EWorkspaceType {
  Channel = 'Channel',
  Board = 'Board',
  Group = 'Group',
  Direct = 'Direct',
  Team = 'Team'
}

export enum EWorkspaceStatus {
  Private = 'Private',
  Public = 'Public'
}

export enum EMemberRole {
  Admin = 'Admin',
  Member = 'Member'
}

export enum EMemberStatus {
  Invited = 'Invited',
  Declined = 'Declined',
  Active = 'Active',
  Leaved = 'Leaved',
  Kicked = 'Kicked'
}

export enum EMessageType {
  Normal = 'Normal',
  System = 'System'
}

export enum EPropertyType {
  Date = 'Date',
  Number = 'Number',
  String = 'String',
  People = 'People',
  MultiPeople = 'MultiPeople',
  Select = 'Select',
  MultiSelect = 'MultiSelect',
  Link = 'Link',
  Email = 'Email',
  Assignees = 'Assignees',
  DueDate = 'DueDate'
}

export type TUser = {
  id: string
  firebaseId?: string
  userName: string
  email: string
  nickName?: string
  password?: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  avatar?: TFile
  avatarId?: string
  createdFiles: TFile[]
  modifiedFiles: TFile[]
  createdWorkspaces: TWorkspace[]
  modifiedWorkspaces: TWorkspace[]
  createdMembers: TMember[]
  modifiedMembers: TMember[]
  members: TMember[]
  createdMessages: TMessage[]
  modifiedMessages: TMessage[]
  createdCards: TCard[]
  modifiedCards: TCard[]
  createdProperties: TProperty[]
  modifiedProperties: TProperty[]
  createdPropertyOptions: TPropertyOption[]
  modifiedPropertyOptions: TPropertyOption[]
  createdMentions: TMention[]
  modifiedMentions: TMention[]
  mentions: TMention[]
  reactionMessages: TReaction[]
}

export type TFile = {
  id: string
  path: string
  size?: number
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  sourceType: EFileSourceType
  createdBy?: TUser
  createdById?: string
  modifiedBy?: TUser
  modifiedById?: string
  workspacesAvatar: TWorkspace[]
  workspacesThumbnail: TWorkspace[]
  usersAvatar: TUser[]
  cardsThumbnail: TCard[]
  messagesAttachment: TMessageAttachment[]
  cardsAttachment: TCardAttachment[]
}

export type TWorkspace = {
  id: string
  title: string
  description?: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  type: EWorkspaceType
  status: EWorkspaceStatus
  displayUrl?: string
  createdBy?: TUser
  createdById?: string
  modifiedBy?: TUser
  modifiedById?: string
  avatar?: TFile
  avatarId?: string
  thumbnail?: TFile
  thumbnailId?: string
  workspaceParent?: TWorkspace
  workspaceParentId?: string
  workspacesChildren: TWorkspace[]
  members: TMember[]
  messages: TMessage[]
  cards: TCard[]
  properties: TProperty[]
}

export type TMember = {
  createdAt: Date
  updatedAt: Date
  role: EMemberRole
  status: EMemberStatus
  user: TUser
  userId: string
  workspace: TWorkspace
  workspaceId: string
  createdBy?: TUser
  createdById?: string
  modifiedBy?: TUser
  modifiedById?: string
}

export type TMessage = {
  id: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  type: EMessageType
  content?: any
  isPinned?: boolean
  createdBy?: TUser
  createdById?: string
  modifiedBy?: TUser
  modifiedById?: string
  workspace: TWorkspace
  workspaceId: string
  replyTo?: TMessage
  replyToId?: string
  replyMessages: TMessage[]
  threadTo?: TMessage
  threadToId?: string
  theadMessages: TMessage[]
  reactions: TReaction[]
  mentions: TMention[]
  attachments: TMessageAttachment[]
}

export type TCard = {
  id: string
  title: string
  description?: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  detail?: any
  properties?: any
  thumbnail?: TFile
  thumbnailId?: string
  createdBy?: TUser
  createdById?: string
  modifiedBy?: TUser
  modifiedById?: string
  workspace: TWorkspace
  workspaceId: string
  attachments: TCardAttachment[]
}

export type TProperty = {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  detail?: any
  order: number
  type: EPropertyType
  workspace: TWorkspace
  workspaceId: string
  createdBy?: TUser
  createdById?: string
  modifiedBy?: TUser
  modifiedById?: string
  options: TPropertyOption[]
}

export type TPropertyOption = {
  id: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  value: string
  label: string
  color?: string
  order: number
  property: TProperty
  propertyId: string
  createdBy?: TUser
  createdById?: string
  modifiedBy?: TUser
  modifiedById?: string
}

export type TReaction = {
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  type: string
  content?: string
  user: TUser
  userId: string
  message: TMessage
  messageId: string
}

export type TMention = {
  user: TUser
  userId: string
  message: TMessage
  messageId: string
  createdBy?: TUser
  createdById?: string
  modifiedBy?: TUser
  modifiedById?: string
}

export type TMessageAttachment = {
  message: TMessage
  messageId: string
  file: TFile
  fileId: string
}

export type TCardAttachment = {
  card: TCard
  cardId: string
  file: TFile
  fileId: string
}

export const RoleWeights = {
  [EMemberRole.Admin]: 10,
  [EMemberRole.Member]: 1
}
