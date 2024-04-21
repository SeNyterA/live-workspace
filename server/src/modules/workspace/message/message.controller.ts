import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common'
import { Message } from '@prisma/client'
import { UserId } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { MessageService } from './message.service'

@Controller('workspaces/:workspaceId/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  createMessage(
    @UserId() userId: string,
    @Body()
    payload: {
      message: Message
    },
    @Param('workspaceId') targetId: string
  ) {
    return this.messageService.createMessage({
      userId,
      targetId,
      ...payload
    })
  }

  @Delete(':messageId')
  deleteMessage(
    @UserId() userId: string,
    @Param('workspaceId')
    targetId: string,
    @Param('messageId')
    messageId: string
  ) {
    return this.messageService.deleteMessage({
      userId,
      messageId,
      targetId
    })
  }

  @Post(':messageId/react')
  async reactMessage(
    @UserId() userId: string,
    @Param('workspaceId') targetId: string,
    @Param('messageId') messageId: string,
    @Body()
    payload: {
      native?: string
      shortcode?: string
      unified: string
    }
  ) {
    return this.messageService.reactMessage({
      userId,
      messageId,
      targetId,
      icon: payload
    })
  }

  @Post(':messageId/pin')
  pinMessage(
    @UserId() userId: string,
    @Param('workspaceId')
    targetId: string,
    @Param('messageId')
    messageId: string
  ) {
    return this.messageService.pinMessage({
      userId,
      messageId,
      targetId
    })
  }

  @Get('/pined')
  getPinedMessages(
    @UserId() userId: string,
    @Param('workspaceId') targetId: string
  ) {
    return this.messageService.getPinedMessages({ userId, targetId })
  }

  @Get()
  getMessages(
    @UserId() userId: string,
    @Param('workspaceId') targetId: string,
    @Query('fromId') fromId: string,
    @Query('size') size: number
  ) {
    return this.messageService.getMessages({
      targetId,
      fromId,
      size: Number(size) || 100,
      userId
    })
  }
}
