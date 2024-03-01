import { Body, Controller, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Member } from 'src/entities/member.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { GroupService } from '../group/group.service'

@Controller('directs')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  createDirect(
    @HttpUser() user: TJwtUser,
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
      user,
      workspace,
      members
    })
  }
}
