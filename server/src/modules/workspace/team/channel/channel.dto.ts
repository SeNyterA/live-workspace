import { IsEnum, IsNotEmpty } from 'class-validator'
import {
  CreateWorkspaceDto,
  MemberDto,
  UpdateWorkspaceDto
} from '../../workspace.dto'
import { EStatusType } from '../../workspace.schema'

export class CreateChannelMemberDto extends MemberDto {}

export class UpdateChannelMemberDto extends MemberDto {}

export class CreateChannelDto extends CreateWorkspaceDto {
  @IsEnum(EStatusType)
  @IsNotEmpty()
  channelType: EStatusType
}

export class UpdateChannelDto extends UpdateWorkspaceDto {}
