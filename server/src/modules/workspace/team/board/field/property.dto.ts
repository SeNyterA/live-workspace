import { Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { EFieldType } from './property.schema'

export class OptionDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  color: string
}

export class PropertyDto {
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
