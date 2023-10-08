import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { Channel } from '../schemas/channel.schema'
import { ChannelService } from '../services/channel.service'
import { TeamService } from '../services/team.service'

@Controller('workspace/teams/:teamId/channels')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly teamService: TeamService
  ) {}

  @Post()
  create(@Body() channel: Channel, @Param('teamId') teamId: string) {
    // Set the teamId for the channel
    channel.teamId = teamId
    return this.channelService.create(channel)
  }

  @Get()
  findAll(@Param('teamId') teamId: string) {
    // return this.channelService.findAllForTeam(teamId);
  }

  @Get(':id')
  findOne(@Param('teamId') teamId: string, @Param('id') id: string) {
    // return this.channelService.findByIdForTeam(teamId, id);
  }

  @Patch(':id')
  async update(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() channel: Partial<Channel>
  ) {
    return 1
    // return this.channelService.update(id, channel);
  }

  @Delete(':id')
  remove(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.channelService.remove(id)
  }
}
