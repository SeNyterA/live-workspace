import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { UserId } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { MemberService } from './member.service'
import { Member } from '@prisma/client'

@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('members/invitions')
  getInvitions(@UserId() userId: string) {
    return this.memberService.getInvitions({ userId })
  }

  @Post('workspaces/:workspaceId/accept-invition')
  acceptInvition(
    @UserId() userId: string,
    @Param('workspaceId') workspaceId: string
  ) {
    return this.memberService.acceptInvition({
      userId,
      workspaceId
    })
  }

  @Post('workspaces/:workspaceId/decline-invition')
  declineInvition(
    @UserId() userId: string,
    @Param('workspaceId') workspaceId: string
  ) {
    return this.memberService.declineInvition({
      userId,
      workspaceId
    })
  }

  @Delete('workspaces/:workspaceId/members')
  leaveWorkspace(
    @UserId() userId: string,
    @Param('workspaceId') workspaceId: string
  ) {
    return this.memberService.leaveWorkspace({
      userId,
      workspaceId
    })
  }

  @Get('workspaces/:workspaceId/members')
  workspaceMembers(
    @UserId() userId: string,
    @Param('workspaceId') workspaceId: string
  ) {}

  @Post('workspaces/:workspaceId/members')
  inviteMember(
    @UserId() userId: string,
    @Param('workspaceId') workspaceId: string,
    @Body() inviteMemberId: string
  ) {
    return this.memberService.inviteMember({
      userId,
      workspaceId,
      memberUserId: inviteMemberId
    })
  }

  @Patch('workspaces/:workspaceId/members/:memberId')
  updateWorkspaceMember(
    @UserId() userId: string,
    @Param('workspaceId') workspaceId: string
  ) {}
}
