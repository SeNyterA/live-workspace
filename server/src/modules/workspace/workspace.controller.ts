import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from '../socket/socket.gateway'
import { WorkspaceService } from './workspace.service'
import { Member, Workspace } from '@prisma/client'

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
}
