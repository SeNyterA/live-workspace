import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'

import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from '../socket/socket.gateway'
import { WorkspaceService } from './workspace.service'
import { Member } from 'src/entities/member.entity'

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  getAllWorkspace(@HttpUser() user: TJwtUser) {
    return this.workspaceService.getAllWorkspace({ user })
  }

  @Get(':id')
  getWorkspace(@HttpUser() user: TJwtUser, @Param('id') workspaceId: string) {
    return this.workspaceService.getWorkspaceById({ user, workspaceId })
  }

  @Get(':id/files')
  getFiles(@HttpUser() user: TJwtUser, @Param('id') workspaceId: string) {
    return this.workspaceService.getWorkspaceFiles({ user, workspaceId })
  }

  @Patch(':id')
  updateWorkspace(
    @HttpUser() user: TJwtUser,
    @Param('id') workspaceId: string,
    @Body() { workspace }: { workspace: Workspace }
  ) {
    return this.workspaceService.updateWorkspace({
      user,
      workspaceId,
      workspace
    })
  }

  @Patch(':id/members/:memberId')
  updateMember(
    @HttpUser() user: TJwtUser,
    @Param('id') workspaceId: string,
    @Param('memberId') memberId: string,
    @Body() { member }: { member: Member }
  ) {
    return this.workspaceService.editMember({
      user,
      workspaceId,
      member,
      memberId
    })
  }
}
