import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'

import { HttpUser } from 'src/decorators/users.decorator'
import { EMessageFor } from '../message/message.schema'
import { MessageService } from '../message/message.service'
import { TJwtUser } from '../workspace.gateway'
import { DirectMessage } from './direct-message.schema'
import { DirectMessageService } from './direct-message.service'

@Controller('/workspace/direct-messages')
export class DirectMessageController {
  constructor(
    private readonly directMessageService: DirectMessageService,
    private readonly messageService: MessageService
  ) {}

  @Get('/all')
  findAll() {
    return this.directMessageService.findAll()
  }

  @Get('')
  getDirectMessInfo(
    @HttpUser() user: TJwtUser,
    @Query('directId') directId?: string,
    @Query('targetEmail') targetEmail?: string,
    @Query('targetId') targetId?: string,
    @Query('targetUserName') targetUserName?: string
  ) {
    return this.directMessageService.getDirectMessInfo({
      userId: user.sub,
      directId,
      targetEmail,
      targetId,
      targetUserName
    })
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() directMessage: Partial<DirectMessage>
  ) {
    return this.directMessageService.update(id, directMessage)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.directMessageService.remove(id)
  }

  @Post(':targetId/messages')
  sendMesage(
    @Param('targetId') targetId: string,
    @HttpUser() user: TJwtUser,
    @Body()
    messagePayload: {
      content: string
    }
  ) {
    return this.messageService._createForDirect({
      targetId: targetId,
      userId: user.sub,
      messagePayload
    })
  }

  @Get(':targetId/messages')
  messages(
    @Param('targetId') targetId: string,
    @HttpUser() user: TJwtUser,
    @Query('formId') fromId?: string,
    @Query('pageSize') pageSize = 100
  ) {
    return this.messageService._getMessages({
      messageReferenceId: targetId,
      userId: user.sub,
      messgaeFor: EMessageFor.Direct,
      pageSize,
      fromId
    })
  }
}
