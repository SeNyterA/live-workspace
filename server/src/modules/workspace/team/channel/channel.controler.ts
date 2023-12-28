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

import { EMessageFor } from '../../message/message.schema'
import { MessageService } from '../../message/message.service'
import { TJwtUser } from '../../workspace.gateway'
import { ChannelDto, UpdateChannelDto } from './channel.dto'
import { ChannelService } from './channel.service'

@Controller('workspace')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly messageService: MessageService
  ) {}

  @Get('channels/:id')
  findOne(@HttpUser() user: TJwtUser, @Param('id') id: string) {
    return this.channelService.getChannelById({
      id: id,
      userId: user.sub
    })
  }

  @Get('channels')
  findAll(@HttpUser() user: TJwtUser) {
    return this.channelService.getChannelsByUserId(user.sub)
  }

  @Post('teams/:teamId/channels')
  create(
    @HttpUser() user: TJwtUser,
    @Body() channelDto: ChannelDto,
    @Param('teamId') teamId: string
  ) {
    return this.channelService._create({
      channelDto,
      userId: user.sub,
      teamId
    })
  }

  @Patch('channels/:id')
  update(
    @Param('id') id: string,
    @HttpUser() user: TJwtUser,
    @Body() channelPayload: UpdateChannelDto
  ) {
    return this.channelService.update({
      id,

      userId: user.sub,
      channelPayload
    })
  }

  @Delete('channels/:id')
  delete(@Param('id') id: string, @HttpUser() user: TJwtUser) {
    return this.channelService.delete({
      id,
      userId: user.sub
    })
  }

  @Post('channels/:id/messages')
  sendMesage(
    @Param('id') id: string,
    @HttpUser() user: TJwtUser,
    @Body()
    messagePayload: {
      content: string
      attachments?: string[]
    }
  ) {
    return this.messageService._createForChannel({
      channelId: id,
      userId: user.sub,
      messagePayload
    })
  }

  @Get('channels/:id/messages')
  messages(@Param('id') id: string, @HttpUser() user: TJwtUser) {
    return this.messageService._getMessages({
      messageReferenceId: id,
      userId: user.sub,
      messgaeFor: EMessageFor.Channel
    })
  }
}
