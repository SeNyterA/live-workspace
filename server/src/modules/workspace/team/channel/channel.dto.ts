import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { EChannelMemberType, EChannelType } from './channel.schema'

export class CreateChannelMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsEnum(EChannelMemberType)
  @IsNotEmpty()
  type: EChannelMemberType
}

export class UpdateChannelMemberDto {
  @IsEnum(EChannelMemberType)
  @IsNotEmpty()
  type: EChannelMemberType
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

  @IsEnum(EChannelType)
  @IsNotEmpty()
  channelType: EChannelType
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
