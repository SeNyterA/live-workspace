import { Body, Controller, Get, Param, Patch } from '@nestjs/common'
import { Workspace } from '@prisma/client'
import { UserId } from 'src/decorators/users.decorator'
import { TJwtUser } from '../socket/socket.gateway'
import { WorkspaceService } from './workspace.service'

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  getAllWorkspace(@UserId() userId: string) {
    return this.workspaceService.getAllWorkspace({ userId })
  }

  @Get(':id')
  getWorkspace(@UserId() userId: string, @Param('id') workspaceId: string) {
    return this.workspaceService.getWorkspaceById({ userId, workspaceId })
  }

  @Get(':id/files')
  getWorkspaceAttachments(
    @UserId() userId: string,
    @Param('id') workspaceId: string
  ) {
    return this.workspaceService.getWorkspaceAttachFiles({ userId, workspaceId })
  }

  @Patch(':id')
  updateWorkspace(
    @UserId() userId: string,
    @Param('id') workspaceId: string,
    @Body() { workspace }: { workspace: Workspace }
  ) {
    return this.workspaceService.updateWorkspace({
      userId,
      workspaceId,
      workspace
    })
  }
}
