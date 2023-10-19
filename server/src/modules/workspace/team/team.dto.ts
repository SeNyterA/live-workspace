
import { Member } from '../member/member.schema'
import { Team } from './team.schema'

export type TTeam = Team
export type TTeamMember = Member

export type TCreateTeamPayload = Pick<TTeam, 'avatar' | 'title' | 'description'>

export type TUpdateTeamPayload = Partial<TCreateTeamPayload>

export type TTeamMemberPayload = Partial<TTeam>
