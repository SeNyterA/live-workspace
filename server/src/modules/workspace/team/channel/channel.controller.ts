import { Body, Controller, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { ChannelService } from './channel.service'
import { Member, Workspace } from '@prisma/client'

@Controller()
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post('teams/:teamId/channels')
  createChannel(
    @HttpUser() user: TJwtUser,
    @Param('teamId') teamId: string,
    @Body() { workspace, members }: { workspace: Workspace; members: Member[] }
  ) {
    return this.channelService.createChannel({
      user,
      teamId,
      workspace,
      members
    })
  }
}
