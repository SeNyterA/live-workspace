import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request
} from '@nestjs/common'
import { getUserId } from 'src/libs/getUserId'
import {
  TCreateTeamPayload,
  TTeamMemberPayload,
  TUpdateTeamPayload
} from './team.dto'
import { TeamService } from './team.service'

@Controller('/workspace/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Request() req, @Body() team: TCreateTeamPayload) {
    return this.teamService.create({
      team: team,
      userId: getUserId(req)
    })
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.teamService.getTeamById({
      id: id,
      userId: getUserId(req)
    })
  }

  @Get()
  findAll(@Request() req) {
    return this.teamService.getTeamsByUserId(getUserId(req))
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() teamPayload: TUpdateTeamPayload
  ) {
    return this.teamService.update({
      id,
      userId: getUserId(req),
      teamPayload
    })
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.teamService.delete({
      id: id,
      userId: getUserId(req)
    })
  }

  @Post(':id')
  editMembers(
    @Request() req,
    @Param('id') id: string,
    @Body() membersPayload: TTeamMemberPayload[]
  ) {
    return this.teamService.editMembers({
      teamMembersPayload: membersPayload,
      userId: getUserId(req),
      id: id
    })
  }
}
