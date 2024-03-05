import { Body, Controller, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Member } from 'src/entities/member.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { ChannelService } from './channel.service'

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
