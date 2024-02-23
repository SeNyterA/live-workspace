import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common'
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

  @Delete(':messageId')
  deleteMessage(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId')
    targetId: string,
    @Param('messageId')
    messageId: string
  ) {
    return this.messageService.deleteMessage({
      user,
      messageId,
      targetId
    })
  }

  @Post(':messageId/pin')
  pinMessage(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId')
    targetId: string,
    @Param('messageId')
    messageId: string
  ) {
    return this.messageService.pinMessage({
      user,
      messageId,
      targetId
    })
  }

  @Get('/pined')
  getPinedMessages(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') targetId: string
  ) {
    return this.messageService.getPinedMessages({ user, targetId })
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
