import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { Workspace } from '@prisma/client'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from '../socket/socket.gateway'
import { WorkspaceService } from './workspace.service'

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
  getWorkspaceAttachments(
    @HttpUser() user: TJwtUser,
    @Param('id') workspaceId: string
  ) {
    return this.workspaceService.getWorkspaceAttachFiles({ user, workspaceId })
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
