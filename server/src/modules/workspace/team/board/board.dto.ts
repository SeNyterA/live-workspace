import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { CreateWorkspaceDto, MembersDto } from '../../workspace.dto'
import { EFieldType } from './property/property.schema'

export class CreateBoardMembersDto extends MembersDto {}

export class UpdateBoardMembersDto extends MembersDto {}

export class OptionDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  color: string
}

export class BoardPropertyDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsEnum(EFieldType)
  @IsNotEmpty()
  fieldType: EFieldType

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  fieldOption?: OptionDto[]
}

export class BoardDto extends CreateWorkspaceDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BoardPropertyDto)
  properties?: BoardPropertyDto[]
}
