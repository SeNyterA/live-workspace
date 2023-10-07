import { Team } from '../schemas/team.schema';

export type TTeam = Team;

export type TCreateTeamPayload = Pick<
  TTeam,
  'avatar' | 'title' | 'description'
>;

export type TUpdateTeamPayload = Partial<TCreateTeamPayload>;
