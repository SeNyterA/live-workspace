import { Body, Controller, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Member } from 'src/entities/member.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { TeamService } from './team.service'

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(
    @HttpUser() user: TJwtUser,
    @Body()
    {
      workspace,
      channels,
      boards,
      members
    }: {
      workspace: Workspace
      channels?: Workspace[]
      boards?: Workspace[]
      members?: Member[]
    }
  ) {
    return this.teamService.createTeam({
      user,
      workspace,
      channels,
      boards,
      members
    })
  }
}
