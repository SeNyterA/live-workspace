import { Controller, Get } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { WorkspaceService } from './workspace.service'

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  getAllWorkspace(@HttpUser() user: TJwtUser) {
    return this.workspaceService.getAllWorkspace({ user })
  }
}
