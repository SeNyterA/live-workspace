import { Body, Controller, Post } from '@nestjs/common'
import { UserId } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { TeamService } from './team.service'
import { Member, Workspace } from '@prisma/client'

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(
    @UserId() userId: string,
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
      userId,
      workspace,
      channels,
      boards,
      members
    })
  }
}
