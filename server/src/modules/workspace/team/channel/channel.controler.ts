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
import { CreateChannelDto, UpdateChannelDto } from './channel.dto'
import { ChannelService } from './channel.service'
import { CreateWorkspaceDto } from '../../workspace.dto'

@Controller('workspace')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('channels/:id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.channelService.getChannelById({
      id: id,
      userId: getUserId(req)
    })
  }

  @Get('channels')
  findAll(@Request() req) {
    return this.channelService.getChannelsByUserId(getUserId(req))
  }

  @Post('teams/:teamId/channels')
  create(
    @Request() req,
    @Body() channelPayload: CreateChannelDto,
    @Param('teamId') teamId: string
  ) {
    return this.channelService.create({
      channel: channelPayload,
      userId: getUserId(req),
      teamId
    })
  }

  @Patch('channels/:id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() channelPayload: UpdateChannelDto
  ) {
    return this.channelService.update({
      id,

      userId: getUserId(req),
      channelPayload
    })
  }

  @Delete('channels/:id')
  delete(@Param('id') id: string, @Request() req) {
    return this.channelService.delete({
      id,
      userId: getUserId(req)
    })
  }
}
