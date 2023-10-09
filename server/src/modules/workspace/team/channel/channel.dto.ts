import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { EMemberType, EStatusType } from '../../workspace.schema'

export class CreateChannelMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsEnum(EMemberType)
  @IsNotEmpty()
  type: EMemberType
}

export class UpdateChannelMemberDto {
  @IsEnum(EMemberType)
  @IsNotEmpty()
  type: EMemberType
}

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsEnum(EStatusType)
  @IsNotEmpty()
  channelType: EStatusType
}

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  avatar?: string
}
