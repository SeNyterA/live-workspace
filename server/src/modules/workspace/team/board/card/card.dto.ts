import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Validate,
  ValidateNested
} from 'class-validator'
import { EBlockType } from './card.schema'

export class CardDto {
  @IsString()
  @IsOptional()
  title?: string

  @IsOptional()
  @IsObject()
  properties?: {
    [key: string]: string | string[] | undefined
  }

  @IsOptional()
  @IsObject()
  data?: {
    [key: string]: string | string[] | undefined
  }
}

export class BlockDto {
  @IsOptional()
  // @Matches(new RegExp(`^(${Object.values(EBlockType).join('|')})$`))
  @Validate(({ value }) => {
    if (!Object.values(EBlockType).includes(value)) {
      return false
    }
    return true
  })
  blockType?: EBlockType

  @IsString()
  @IsOptional()
  content?: string

  @IsBoolean()
  @IsOptional()
  isCheck?: boolean

  @IsArray()
  @IsOptional()
  files?: string[]
}
