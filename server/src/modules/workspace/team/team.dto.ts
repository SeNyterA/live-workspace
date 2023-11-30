import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Member } from '../member/member.schema'
import { CreateWorkspaceDto } from '../workspace.dto'
import { Team } from './team.schema'

export type TTeam = Team
export type TTeamMember = Member

export type TCreateTeamPayload = Pick<TTeam, 'avatar' | 'title' | 'description'>

export type TUpdateTeamPayload = Partial<TCreateTeamPayload>

export type TTeamMemberPayload = Partial<TTeam>

export class TeamDto extends CreateWorkspaceDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  channelTitles?: string[]

  @IsString()
  @IsNotEmpty()
  title?: string
}
