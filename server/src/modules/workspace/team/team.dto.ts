import { Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsOptional,
  ValidateNested
} from 'class-validator'
import { Member } from '../member/member.schema'
import { CreateWorkspaceDto, MemberDto } from '../workspace.dto'
import { ChannelDto } from './channel/channel.dto'
import { Team } from './team.schema'

export type TTeam = Team
export type TTeamMember = Member

export type TCreateTeamPayload = Pick<TTeam, 'avatar' | 'title' | 'description'>

export type TUpdateTeamPayload = Partial<TCreateTeamPayload>

export type TTeamMemberPayload = Partial<TTeam>

export class TeamDto extends CreateWorkspaceDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ChannelDto)
  channels?: ChannelDto[]
}
