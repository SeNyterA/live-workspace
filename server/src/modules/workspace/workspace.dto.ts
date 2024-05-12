import { WorkspaceStatus } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'

class WorkspaceDto {
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
