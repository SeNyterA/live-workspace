import { Controller, Get } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { MessageService } from './message.service'

@Controller('workspaces')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  getAllWorkspace(@HttpUser() user: TJwtUser) {}
}
