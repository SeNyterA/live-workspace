import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { getUserId } from 'src/libs/getUserId';
import { TCreateTeamPayload } from '../dto/team.dto';
import { Team } from '../schemas/team.schema';
import { TeamService } from '../services/team.service';

@Controller('/workspace/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Request() req, @Body() team: TCreateTeamPayload) {
    return this.teamService.create({
      team: team,
      userId: getUserId(req),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findById(id);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() team: Team) {
    return this.teamService.update(id, team);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}
