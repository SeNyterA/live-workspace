import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

import { Type } from 'class-transformer'
import { EMemberType } from './member/member.schema'

export class MemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsEnum(EMemberType)
  @IsNotEmpty()
  type: EMemberType
}

export class MembersDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MemberDto)
  members: MemberDto[]
}

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  avatar?: string
}

export class UpdateWorkspaceDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  avatar?: string
}
