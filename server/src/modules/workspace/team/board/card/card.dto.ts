import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'

export class CardDto {
  @IsString()
  @IsNotEmpty()
  title?: string

  @IsOptional()
  @IsObject()
  data?: {
    [key: string]: string | string[] | undefined
  }
}
