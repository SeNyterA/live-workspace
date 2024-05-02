import { Body, Controller, Param, Post } from '@nestjs/common'
import { Workspace } from '@prisma/client'
import { UserId } from 'src/decorators/users.decorator'
import { DirectService } from './direct.service'

@Controller('')
export class DirectController {
  constructor(private readonly directService: DirectService) {}

  @Post('directs/:userTargetId')
  createDirect(
    @UserId() userId: string,
    @Param('userTargetId') userTargetId: string,
    @Body() { workspace }: { workspace: Workspace }
  ) {
    return this.directService.createDirect({
      userId,
      workspace,
      userTargetId
    })
  }
}
