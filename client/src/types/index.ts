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
  avatarId?: string
}

export type TUserExtra = TUser & {
  avatar?: TFile
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
  createdById?: string
  modifiedById?: string
}

export type TFileExtra = TFile & {
  createdBy?: TUser
  modifiedBy?: TUser
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
  createdById?: string
  modifiedById?: string
  avatarId?: string
  thumbnailId?: string
  workspaceParentId?: string
}

export type TWorkspaceExtra = TWorkspace & {
  createdBy?: TUser
  modifiedBy?: TUser
  avatar?: TFile
  thumbnail?: TFile
  workspaceParent?: TWorkspace
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
  userId: string
  workspaceId: string
  createdById?: string
  modifiedById?: string
}

export type TMemberExtra = TMember & {
  user: TUser
  workspace: TWorkspace
  createdBy?: TUser
  modifiedBy?: TUser
}

export type TMessage = {
  id: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  type: EMessageType
  content?: any
  isPinned?: boolean
  createdById?: string
  modifiedById?: string
  workspaceId: string
  replyToId?: string
  threadToId?: string
}

export type TMessageExtra = TMessage & {
  createdBy?: TUser
  modifiedBy?: TUser
  workspace: TWorkspace
  replyTo?: TMessage
  replyMessages: TMessage[]
  threadTo?: TMessage
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
  thumbnailId?: string
  createdById?: string
  modifiedById?: string
  workspaceId: string
}
export type TCardExtra = TCard & {
  thumbnail?: TFile
  createdBy?: TUser
  modifiedBy?: TUser
  workspace: TWorkspace
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

  workspaceId: string

  createdById?: string

  modifiedById?: string
}

export type TPropertyExtra = TProperty & {
  workspace: TWorkspace
  createdBy?: TUser
  modifiedBy?: TUser
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
  propertyId: string
  createdById?: string
  modifiedById?: string
}

export type TPropertyOptionExtra = TPropertyOption & {
  property: TProperty
  createdBy?: TUser
  modifiedBy?: TUser
}

export type TReaction = {
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  type: string
  content?: string
  userId: string
  messageId: string
}
export type TReactionExtra = TReaction & {
  user: TUser
  message: TMessage
}

export type TMention = {
  userId: string
  messageId: string
  createdById?: string
  modifiedById?: string
}

export type TMentionExtra = TMention & {
  user: TUser
  message: TMessage
  createdBy?: TUser
  modifiedBy?: TUser
}

export type TMessageAttachment = {
  messageId: string
  fileId: string
}

export type TMessageAttachmentExtra = TMessageAttachment & {
  message: TMessage
  file: TFile
}

export type TCardAttachment = {
  cardId: string
  fileId: string
}

export type TCardAttachmentExtra = TCardAttachment & {
  card: TCard
  file: TFile
}

export const RoleWeights = {
  [EMemberRole.Admin]: 10,
  [EMemberRole.Member]: 1
}
