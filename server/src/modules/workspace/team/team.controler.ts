import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/adapters/redis-io.adapter'
import { TCreateTeamPayload, TUpdateTeamPayload } from './team.dto'
import { TeamService } from './team.service'

@Controller('/workspace/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@HttpUser() user: TJwtUser, @Body() team: TCreateTeamPayload) {
    return this.teamService.create({
      team: team,
      userId: user.sub
    })
  }

  @Get(':id')
  findOne(@HttpUser() user: TJwtUser, @Param('id') id: string) {
    return this.teamService.getTeamById({
      id: id,
      userId: user.sub
    })
  }

  @Get()
  findAll(@HttpUser() user: TJwtUser) {
    return this.teamService.getTeamsByUserId(user.sub)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @HttpUser() user: TJwtUser,
    @Body() teamPayload: TUpdateTeamPayload
  ) {
    return this.teamService.update({
      id,
      userId: user.sub,
      teamPayload
    })
  }

  @Delete(':id')
  remove(@HttpUser() user: TJwtUser, @Param('id') id: string) {
    return this.teamService.delete({
      id: id,
      userId: user.sub
    })
  }
}
