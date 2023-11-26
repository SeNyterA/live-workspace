import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested
} from 'class-validator'
import { CreateWorkspaceDto, MemberDto } from '../workspace.dto'

export class GroupDto extends CreateWorkspaceDto {
  @ArrayMinSize(1)
  members: MemberDto[]
}
