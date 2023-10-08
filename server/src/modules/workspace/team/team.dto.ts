import { Team, TeamMember } from './team.schema'

export type TTeam = Team
export type TTeamMember = TeamMember

export type TCreateTeamPayload = Pick<TTeam, 'avatar' | 'title' | 'description'>

export type TUpdateTeamPayload = Partial<TCreateTeamPayload>

export type TTeamMemberPayload = Partial<TTeam>
