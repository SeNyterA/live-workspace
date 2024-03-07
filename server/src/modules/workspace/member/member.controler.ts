import { Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { MemberService } from './member.service'

@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('members/invitions')
  getInvitions(@HttpUser() user: TJwtUser) {
    return this.memberService.getInvitions({ user })
  }

  @Post('workspace/:workspaceId/accept-invition')
  acceptInvition(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {
    return this.memberService.acceptInvition({
      user,
      workspaceId
    })
  }

  @Post('workspace/:workspaceId/decline-invition')
  declineInvition(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {
    return this.memberService.declineInvition({
      user,
      workspaceId
    })
  }

  @Get('workspace/:workspaceId/members')
  workspaceMembers(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {}

  @Post('workspace/:workspaceId/members')
  inviteMember(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {}

  @Patch('workspace/:workspaceId/members/:memberId')
  updateWorkspaceMember(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {}
}
