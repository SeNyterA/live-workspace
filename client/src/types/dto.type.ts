import { EMemberRole, EStatusType } from './workspace.type'

export type TMemberDto = {
  userId: string
  role: EMemberRole
}

export type TWorkspaceDto = {
  title: string
  description?: string
  avatar?: string
  members?: TMemberDto[]
}

export type TGroupDto = TWorkspaceDto

export type TChannelDto = TWorkspaceDto & {
  channelType: EStatusType
}