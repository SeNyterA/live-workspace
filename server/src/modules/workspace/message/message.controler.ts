import { Body, Controller, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from '../workspace.gateway'
import { MessageService } from './message.service'

@Controller('workspace')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('messages/:messageId/reaction')
  reaction(
    @HttpUser() user: TJwtUser,
    @Body() payload: { icon: string },
    @Param('messageId') messageId: string
  ) {
    return this.messageService.reaction({
      payload,
      messageId,
      userId: user.sub
    })
  }
}
