import { Body, Controller, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { DirectService } from './direct.service'
import { Workspace } from '@prisma/client'

@Controller('directs')
export class GroupController {
  constructor(private readonly directService: DirectService) {}

  @Post('/:userTargetId')
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
