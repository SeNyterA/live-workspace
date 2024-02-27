import { Controller, Get, Param } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'

import { WorkspaceService } from './workspace.service'
import { TJwtUser } from '../socket/socket.gateway'

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
}
