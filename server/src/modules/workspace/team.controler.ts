import { Controller, Get } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'

import { TJwtUser } from './workspace.gateway'
import { WorkspaceService } from './workspace.service'

@Controller('/workspace')
export class WorkpaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  findAll(@HttpUser() user: TJwtUser) {
    return this.workspaceService.getWorkspaceData(user.sub)
  }
}
