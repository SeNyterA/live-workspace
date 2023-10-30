import { Controller, Get, Param, Query } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'

import { MemberService } from './member/member.service'
import { TJwtUser } from './workspace.gateway'
import { WorkspaceService } from './workspace.service'

@Controller('/workspace')
export class WorkpaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly memberService: MemberService
  ) {}

  @Get()
  findAll(@HttpUser() user: TJwtUser) {
    return this.workspaceService.getWorkspaceData(user.sub)
  }

  @Get('/members/:targetId')
  getMembersByTargetId(
    @HttpUser() user: TJwtUser,
    @Param('targetId') targetId: string,
    @Query('includeUsers') includeUsers?: string
  ) {
    const includeUsersFlag = includeUsers === 'true'
    return this.memberService.getMembersByTargetId({
      targetId,
      userId: user.sub,
      includeUsers: includeUsersFlag
    })
  }
}
