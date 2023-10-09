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

export class WorkspaceDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  avatar?: string
}
