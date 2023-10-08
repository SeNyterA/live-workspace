import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DirectMessageController } from './direct-message/direct-message.controler'
import {
  DirectMessage,
  DirectMessageSchema
} from './direct-message/direct-message.schema'
import { DirectMessageService } from './direct-message/direct-message.service'
import { GroupController } from './group/group.controler'
import { Group, GroupSchema } from './group/group.schema'
import { ChannelController } from './team/channel/channel.controler'
import { Channel, ChannelSchema } from './team/channel/channel.schema'
import { ChannelService } from './team/channel/channel.service'
import { TeamController } from './team/team.controler'
import { Team, TeamSchema } from './team/team.schema'
import { GroupService } from './group/group.service'
import { TeamService } from './team/team.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: DirectMessage.name, schema: DirectMessageSchema },
      { name: Group.name, schema: GroupSchema }
    ])
  ],
  controllers: [
    TeamController,
    ChannelController,
    DirectMessageController,
    GroupController
  ],
  providers: [ChannelService, TeamService, GroupService, DirectMessageService]
})
export class WorkspaceModule {}
