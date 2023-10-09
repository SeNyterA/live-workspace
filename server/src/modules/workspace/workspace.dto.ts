import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { EMemberType } from './workspace.schema'

export class MemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsEnum(EMemberType)
  @IsNotEmpty()
  type: EMemberType
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
