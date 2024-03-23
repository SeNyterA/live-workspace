import { WorkspaceStatus } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class CreateWorkspaceDto {
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus

  @IsOptional()
  @IsString()
  avatarId?: string

  @IsOptional()
  @IsString()
  thumbnailId?: string
}

export class UpdateWorkspaceDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsEnum(WorkspaceStatus)
  status?: WorkspaceStatus

  @IsOptional()
  @IsString()
  avatarId?: string

  @IsOptional()
  @IsString()
  thumbnailId?: string
}
