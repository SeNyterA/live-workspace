import { IsEnum, IsNotEmpty } from 'class-validator'
import {
  CreateWorkspaceDto,
  MembersDto,
  UpdateWorkspaceDto
} from '../../workspace.dto'
import { EStatusType } from '../../workspace.schema'

export class CreateChannelMembersDto extends MembersDto {}

export class UpdateChannelMembersDto extends MembersDto {}

export class ChannelDto extends CreateWorkspaceDto {
  @IsEnum(EStatusType)
  @IsNotEmpty()
  channelType: EStatusType
}

export class UpdateChannelDto extends UpdateWorkspaceDto {}
