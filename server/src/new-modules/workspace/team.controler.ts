import { Body, Controller, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { WorkspaceService } from './workspace.service'

@Controller('teams')
export class TeamController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(
    @HttpUser() user: TJwtUser,
    @Body() { workspace }: { workspace: Workspace }
  ) {
    return this.workspaceService.createTeam({
      user,
      workspace
    })
  }
}
