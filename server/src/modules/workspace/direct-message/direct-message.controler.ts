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

  @Get()
  findAll() {
    return this.directMessageService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directMessageService.findById(id)
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
  messages(@Param('targetId') targetId: string, @HttpUser() user: TJwtUser) {
    return this.messageService._getMessages({
      messageReferenceId: targetId,
      userId: user.sub,
      messgaeFor: EMessageFor.Direct
    })
  }
}
