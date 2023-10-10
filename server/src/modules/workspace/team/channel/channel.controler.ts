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
import { EMessageFor } from '../../message/message.schema'
import { MessageService } from '../../message/message.service'
import {
  CreateChannelDto,
  CreateChannelMembersDto,
  UpdateChannelDto
} from './channel.dto'
import { ChannelService } from './channel.service'

@Controller('workspace')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService
  ) {}

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

  @Post('channels/:id/members')
  eidtMembers(
    @Param('id') id: string,
    @Request() req,
    @Body() membersPayload: CreateChannelMembersDto
  ) {
    return this.channelService.editMembers({
      id,
      userId: getUserId(req),
      membersPayload
    })
  }

  @Post('channels/:id/messages')
  sendMesage(
    @Param('id') id: string,
    @Request() req,
    @Body() messagePayload: any
  ) {
    return this.messageService._createForChannel({
      channelId: id,
      userId: getUserId(req),
      messagePayload
    })
  }

  @Get('channels/:id/messages')
  messages(@Param('id') id: string, @Request() req) {
    return this.messageService._getMessages({
      messageReferenceId: id,
      userId: getUserId(req),
      messgaeFor: EMessageFor.Channel
    })
  }
}
