import { Body, Controller, Post } from '@nestjs/common'
import { UserId } from 'src/decorators/users.decorator'
import { Member, Workspace } from '@prisma/client'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { GroupService } from './group.service'

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  createGroup(
    @UserId() userId: string,
    @Body()
    {
      workspace,
      members
    }: {
      workspace: Workspace
      members?: Member[]
    }
  ) {
    return this.groupService.createGroup({
      userId,
      workspace,
      members
    })
  }
}
