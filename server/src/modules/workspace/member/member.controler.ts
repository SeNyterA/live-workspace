import { Controller, Get, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { MemberService } from './member.service'

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post(':memberId/accept-invition')
  acceptInvition(
    @HttpUser() user: TJwtUser,
    @Param('memberId') memberId: string
  ) {
    return this.memberService.acceptInvition({
      user,
      memberId
    })
  }

  @Post(':memberId/decline-invition')
  declineInvition(
    @HttpUser() user: TJwtUser,
    @Param('memberId') memberId: string
  ) {
    return this.memberService.declineInvition({
      user,
      memberId
    })
  }

  @Get('invitions')
  getInvitions(@HttpUser() user: TJwtUser) {
    return this.memberService.getInvitions({ user })
  }
}
