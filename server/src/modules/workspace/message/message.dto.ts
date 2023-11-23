import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator'
import { EMessageFor } from './message.schema'
import { CreateWorkspaceDto } from '../workspace.dto'

export class CreateMessageDto extends CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty()
  content: string

  @IsOptional()
  @IsString()
  messageReferenceId?: string

  @IsString({ each: true })
  @IsArray()
  // @ArrayMinSize(1)
  attachments: string[]

  @IsOptional()
  @IsString()
  replyToMessageId?: string

  @IsEnum(EMessageFor)
  @IsNotEmpty()
  messageFor: EMessageFor
}
