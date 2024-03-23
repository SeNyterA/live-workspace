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
  avatar?: TFileExtra
  createdFiles: TFileExtra[]
  modifiedFiles: TFileExtra[]
  createdWorkspaces: TWorkspaceExtra[]
  modifiedWorkspaces: TWorkspaceExtra[]
  createdMembers: TMemberExtra[]
  modifiedMembers: TMemberExtra[]
  members: TMemberExtra[]
  createdMessages: TMessageExtra[]
  modifiedMessages: TMessageExtra[]
  createdCards: TCardExtra[]
  modifiedCards: TCardExtra[]
  createdProperties: TPropertyExtra[]
  modifiedProperties: TPropertyExtra[]
  createdPropertyOptions: TPropertyOptionExtra[]
  modifiedPropertyOptions: TPropertyOptionExtra[]
  createdMentions: TMentionExtra[]
  modifiedMentions: TMentionExtra[]
  mentions: TMentionExtra[]
  reactionMessages: TReactionExtra[]
}

export type TFile = {
  id: string
  path: string
  name?: string
  size?: number
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  sourceType: EFileSourceType
  createdById?: string
  modifiedById?: string
}

export type TFileExtra = TFile & {
  createdBy?: TUserExtra
  modifiedBy?: TUserExtra
  workspacesAvatar: TWorkspaceExtra[]
  workspacesThumbnail: TWorkspaceExtra[]
  usersAvatar: TUserExtra[]
  cardsThumbnail: TCardExtra[]
  messagesAttachment: TMessageAttachmentExtra[]
  cardsAttachment: TCardAttachmentExtra[]
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
  createdBy?: TUserExtra
  modifiedBy?: TUserExtra
  avatar?: TFileExtra
  thumbnail?: TFileExtra
  workspaceParent?: TWorkspaceExtra
  workspacesChildren: TWorkspaceExtra[]
  members: TMemberExtra[]
  messages: TMessageExtra[]
  cards: TCardExtra[]
  properties: TPropertyExtra[]
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
  user: TUserExtra
  workspace: TWorkspaceExtra
  createdBy?: TUserExtra
  modifiedBy?: TUserExtra
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
  createdBy?: TUserExtra
  modifiedBy?: TUserExtra
  workspace: TWorkspaceExtra
  replyTo?: TMessageExtra
  replyMessages: TMessageExtra[]
  threadTo?: TMessageExtra
  theadMessages: TMessageExtra[]
  reactions: TReactionExtra[]
  mentions: TMentionExtra[]
  attachments: TMessageAttachmentExtra[]
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
  thumbnail?: TFileExtra
  createdBy?: TUserExtra
  modifiedBy?: TUserExtra
  workspace: TWorkspaceExtra
  attachments: TCardAttachmentExtra[]
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
  workspace: TWorkspaceExtra
  createdBy?: TUserExtra
  modifiedBy?: TUserExtra
  options: TPropertyOptionExtra[]
}

export type TPropertyOption = {
  id: string
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean
  title: string
  color?: string
  order: number
  propertyId: string
  createdById?: string
  modifiedById?: string
}

export type TPropertyOptionExtra = TPropertyOption & {
  property: TPropertyExtra
  createdBy?: TUserExtra
  modifiedBy?: TUserExtra
}

export type TReaction = {
  createdAt: Date
  updatedAt: Date
  isAvailable: boolean

  userId: string
  messageId: string

  shortcode: string
  unified: string
  native: string
}
export type TReactionExtra = TReaction & {
  user: TUserExtra
  message: TMessageExtra
}

export type TMention = {
  userId: string
  messageId: string
  createdById?: string
  modifiedById?: string
}

export type TMentionExtra = TMention & {
  user: TUserExtra
  message: TMessageExtra
  createdBy?: TUserExtra
  modifiedBy?: TUserExtra
}

export type TMessageAttachment = {
  messageId: string
  fileId: string
  type: 'messageAttactment'
}

export type TMessageAttachmentExtra = TMessageAttachment & {
  message: TMessageExtra
  file: TFileExtra
}

export type TCardAttachment = {
  cardId: string
  fileId: string
  type: 'cardAttactment'
}

export type TCardAttachmentExtra = TCardAttachment & {
  card: TCardExtra
  file: TFileExtra
}

export const RoleWeights = {
  [EMemberRole.Admin]: 10,
  [EMemberRole.Member]: 1
}

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
export type TOptions = { [optionId: string]: TPropertyOption }
export type TFiles = { [fileId: string]: TFile }
export type TAttachments = {
  [attachmentId: string]: TMessageAttachment | TCardAttachment
}
export type TReactions = { [reactionId: string]: TReaction }

export const extractApi = ({
  cards,
  members,
  messages,
  options,
  properties,
  users,
  workspaces
}: {
  workspaces?: TWorkspaceExtra[]
  cards?: TCardAttachmentExtra[]
  messages?: TMessageExtra[]
  members?: TMemberExtra[]
  users?: TUserExtra[]
  properties?: TPropertyExtra[]
  options?: TPropertyOptionExtra[]
}) => {
  const res: any = {
    users: {},
    members: {},
    workspaces: {},
    cards: {},
    files: {},
    options: {},
    attachments: {},
    properties: {},
    messages: {},
    reactions: {}
  }

  const extractUser = (userData: TUserExtra) => {
    const { avatar, ...resUser } = userData
    avatar && (res.files[avatar.id] = avatar)
    res.users[userData.id] = resUser
  }

  const extractMembers = (members: TMemberExtra[]) => {
    members.forEach(member => {
      const { user, ...resMember } = member
      extractUser(user)
      res.members[`${member.workspaceId}_${member.userId}`] = resMember
    })
  }

  const extractMessAttachments = (attachments: TMessageAttachmentExtra[]) => {
    attachments.forEach(attachment => {
      const { file, ...resAttachment } = attachment
      file && (res.files[file.id] = file)

      res.attachments[`${attachment.messageId}_${attachment.fileId}`] = {
        ...resAttachment,
        type: 'messageAttactment'
      }
    })
  }

  const extractCardsAttachments = (attachments: TCardAttachmentExtra[]) => {
    attachments.forEach(attachment => {
      const { file, ...resAttachment } = attachment
      !!file && (res.files[file.id] = file)
      res.attachments[`${attachment.cardId}_${attachment.fileId}`] = {
        ...resAttachment,
        type: 'cardAttactment'
      }
    })
  }

  const extractCards = (cards: TCardExtra[]) => {
    cards.forEach(card => {
      const { thumbnail, attachments, ...resCard } = card
      !!thumbnail && (res.files[thumbnail.id] = thumbnail)
      !!attachments && extractCardsAttachments(attachments)

      res.cards[card.id] = resCard
    })
  }

  const extractMessages = (messages: TMessageExtra[]) => {
    messages.forEach(message => {
      const {
        createdBy,
        modifiedBy,
        replyTo,
        threadTo,
        reactions,
        mentions,
        attachments,
        ...resMessage
      } = message
      !!createdBy && extractUser(createdBy)
      !!modifiedBy && extractUser(modifiedBy)
      !!replyTo && (res.messages[replyTo.id] = replyTo)
      !!threadTo && (res.messages[threadTo.id] = threadTo)
      !!attachments && extractMessAttachments(attachments)
      !!reactions &&
        reactions.forEach(
          reaction =>
            (res.reactions[`${reaction.messageId}_${reaction.userId}`] =
              reaction)
        )

      res.messages[message.id] = resMessage
    })
  }

  const extractOptions = (options: TPropertyOptionExtra[]) => {
    options.forEach(option => {
      res.options[option.id] = option
    })
  }

  const extractProperties = (properties: TPropertyExtra[]) => {
    properties.forEach(property => {
      const { options, ...resProperty } = property
      !!options && extractOptions(options)
      res.properties[property.id] = resProperty
    })
  }

  const extractWorkspaces = (workspaces: TWorkspaceExtra[]) => {
    workspaces.forEach(workspace => {
      const {
        members,
        avatar,
        thumbnail,
        properties,
        messages,
        cards,
        ...resWorkspace
      } = workspace

      !!avatar && (res.files[avatar.id] = avatar)
      !!thumbnail && (res.files[thumbnail.id] = thumbnail)
      !!cards && extractCards(cards)
      !!members && extractMembers(members)
      !!messages && extractMessages(messages)
      !!properties && extractProperties(properties)

      res.workspaces[workspace.id] = resWorkspace
    })
  }

  !!workspaces && extractWorkspaces(workspaces)
  !!cards && extractCardsAttachments(cards)
  !!messages && extractMessages(messages)
  !!members && extractMembers(members)
  !!users && users.forEach(user => extractUser(user))
  !!properties && extractProperties(properties)
  !!options && extractOptions(options)

  return res as {
    users: TUsers
    members: TMembers
    workspaces: TWorkspaces
    cards: TCards
    files: TFiles
    options: TOptions
    attachments: TAttachments
  }
}
