import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Message } from 'src/entities/message.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { MessageService } from './message.service'

@Controller('workspaces/:workspaceId/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  createMessage(
    @HttpUser() user: TJwtUser,
    @Body()
    payload: {
      replyToId?: string
      threadId?: string
      message: Message
    },
    @Param('workspaceId') targetId: string
  ) {
    return this.messageService.createMessage({
      user,
      targetId,
      ...payload
    })
  }

  @Get()
  getMessages(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') targetId: string,
    @Query('fromId') fromId: string,
    @Query('size') size: number
  ) {
    return this.messageService.getMessages({
      targetId,
      fromId,
      size: Number(size) || 100,
      user
    })
  }
}
