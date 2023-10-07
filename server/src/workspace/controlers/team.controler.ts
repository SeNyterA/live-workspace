import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Team } from '../schemas/team.schema';
import { TeamService } from '../services/team.service';

@Controller('/workspace/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() team: Team) {
    return this.teamService.create(team);
  }

  @Get()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findById(id);
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
