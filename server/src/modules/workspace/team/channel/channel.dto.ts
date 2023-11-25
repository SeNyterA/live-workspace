import {
  CreateWorkspaceDto,
  MembersDto,
  UpdateWorkspaceDto
} from '../../workspace.dto'

export class CreateChannelMembersDto extends MembersDto {}

export class UpdateChannelMembersDto extends MembersDto {}

export class ChannelDto extends CreateWorkspaceDto {}

export class UpdateChannelDto extends UpdateWorkspaceDto {}
