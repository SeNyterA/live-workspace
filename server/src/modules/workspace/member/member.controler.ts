import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { MemberService } from './member.service'
import { Member } from '@prisma/client'

@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('members/invitions')
  getInvitions(@HttpUser() user: TJwtUser) {
    return this.memberService.getInvitions({ user })
  }

  @Post('workspaces/:workspaceId/accept-invition')
  acceptInvition(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {
    return this.memberService.acceptInvition({
      user,
      workspaceId
    })
  }

  @Post('workspaces/:workspaceId/decline-invition')
  declineInvition(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {
    return this.memberService.declineInvition({
      user,
      workspaceId
    })
  }

  @Delete('workspaces/:workspaceId/members')
  leaveWorkspace(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {
    return this.memberService.leaveWorkspace({
      user,
      workspaceId
    })
  }

  @Get('workspaces/:workspaceId/members')
  workspaceMembers(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {}

  @Post('workspaces/:workspaceId/members')
  inviteMember(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string,
    @Body() { userId }: Member
  ) {
    return this.memberService.inviteMember({
      user,
      workspaceId,
      memberUserId: userId
    })
  }

  @Patch('workspaces/:workspaceId/members/:memberId')
  updateWorkspaceMember(
    @HttpUser() user: TJwtUser,
    @Param('workspaceId') workspaceId: string
  ) {}
}
