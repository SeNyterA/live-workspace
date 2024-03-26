import { Body, Controller, Param, Post } from '@nestjs/common'
import { Workspace } from '@prisma/client'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { DirectService } from './direct.service'

@Controller('')
export class DirectController {
  constructor(private readonly directService: DirectService) {}

  @Post('directs/:userTargetId')
  createDirect(
    @HttpUser() user: TJwtUser,
    @Param('userTargetId') userTargetId: string,
    @Body() { workspace }: { workspace: Workspace }
  ) {
    return this.directService.createDirect({
      user,
      workspace,
      userTargetId
    })
  }
}
