import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '../users/users.module'
import { DirectMessageController } from './direct-message/direct-message.controler'
import {
  DirectMessage,
  DirectMessageSchema
} from './direct-message/direct-message.schema'
import { DirectMessageService } from './direct-message/direct-message.service'
import { GroupController } from './group/group.controler'
import { Group, GroupSchema } from './group/group.schema'
import { GroupService } from './group/group.service'
import { Message, MessageSchema } from './message/message.schema'
import { MessageService } from './message/message.service'
import { BoardController } from './team/board/board.controler'
import { ChannelController } from './team/channel/channel.controler'
import { Channel, ChannelSchema } from './team/channel/channel.schema'
import { ChannelService } from './team/channel/channel.service'
import { TeamController } from './team/team.controler'
import { Team, TeamSchema } from './team/team.schema'
import { TeamService } from './team/team.service'
import { WorkspaceGateway } from './workspace.gateway'
import { WorkspaceService } from './workspace.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: DirectMessage.name, schema: DirectMessageSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Message.name, schema: MessageSchema }
    ]),
    UsersModule
  ],
  controllers: [
    TeamController,
    ChannelController,
    DirectMessageController,
    GroupController,
    BoardController
  ],
  providers: [
    ChannelService,
    TeamService,
    GroupService,
    DirectMessageService,
    MessageService,
    WorkspaceGateway,
    WorkspaceService
  ]
})
export class WorkspaceModule {}
