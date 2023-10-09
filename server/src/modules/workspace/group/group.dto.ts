import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { EGroupMemberType } from './group.schema'

export class CreateGroupMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsEnum(EGroupMemberType)
  @IsNotEmpty()
  type: EGroupMemberType
}

export class UpdateGroupMemberDto {
  @IsEnum(EGroupMemberType)
  @IsNotEmpty()
  type: EGroupMemberType
}

export class CreateGroupDto {
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

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  avatar?: string

  isAvailable?: string

  validate() {
    console.log(this.isAvailable)
    if (this.isAvailable !== undefined) {
      throw new Error('You are not allowed to change isAvailable.')
    }
  }
}
