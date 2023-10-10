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
import { EMessageFor } from '../message/message.schema'
import { MessageService } from '../message/message.service'
import { DirectMessage } from './direct-message.schema'
import { DirectMessageService } from './direct-message.service'

@Controller('/workspace/direct-messages')
export class DirectMessageController {
  constructor(
    private readonly directMessageService: DirectMessageService,
    private readonly messageService: MessageService
  ) {}

  // @Post()
  // create(@Body() directMessage: DirectMessage) {
  //   return this.directMessageService.create(directMessage)
  // }

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

  @Post(':targetId/')
  sendMesage(
    @Param('targetId') targetId: string,
    @Request() req,
    @Body() messagePayload: any
  ) {
    return this.messageService._createForDirect({
      targetId: targetId,
      userId: getUserId(req),
      messagePayload
    })
  }

  @Get(':targetId/messages')
  messages(@Param('targetId') targetId: string, @Request() req) {
    return this.messageService._getMessages({
      messageReferenceId: targetId,
      userId: getUserId(req),
      messgaeFor: EMessageFor.Direct
    })
  }
}
