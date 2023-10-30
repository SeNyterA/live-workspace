import { Module } from '@nestjs/common'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { RedisModule } from '../redis/redis.module'
import { SocketModule } from '../socket/socket.module'
import { User } from '../users/user.schema'
import { UsersModule } from '../users/users.module'
import { DirectMessageController } from './direct-message/direct-message.controler'
import { DirectMessage } from './direct-message/direct-message.schema'
import { DirectMessageService } from './direct-message/direct-message.service'
import { GroupController } from './group/group.controler'
import { Group } from './group/group.schema'
import { GroupService } from './group/group.service'
import { Member } from './member/member.schema'
import { MemberService } from './member/member.service'
import { Message } from './message/message.schema'
import { MessageService } from './message/message.service'
import { BoardController } from './team/board/board.controler'
import { ChannelController } from './team/channel/channel.controler'
import { Channel } from './team/channel/channel.schema'
import { ChannelService } from './team/channel/channel.service'
import { TeamController } from './team/team.controler'
import { Team } from './team/team.schema'
import { TeamService } from './team/team.service'
import { WorkpaceController } from './workspace.controler'
import { WorkspaceGateway } from './workspace.gateway'
import { Workspace } from './workspace.schema'
import { WorkspaceService } from './workspace.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: SchemaFactory.createForClass(Team) },
      { name: Channel.name, schema: SchemaFactory.createForClass(Channel) },
      {
        name: DirectMessage.name,
        schema: SchemaFactory.createForClass(DirectMessage)
      },
      { name: Group.name, schema: SchemaFactory.createForClass(Group) },
      { name: Message.name, schema: SchemaFactory.createForClass(Message) },
      { name: Member.name, schema: SchemaFactory.createForClass(Member) },
      { name: Workspace.name, schema: SchemaFactory.createForClass(Workspace) },
      { name: User.name, schema: SchemaFactory.createForClass(User) }
    ]),
    UsersModule,
    RedisModule,
    SocketModule
  ],
  controllers: [
    TeamController,
    ChannelController,
    DirectMessageController,
    GroupController,
    BoardController,
    WorkpaceController
  ],
  providers: [
    ChannelService,
    TeamService,
    GroupService,
    DirectMessageService,
    MessageService,
    WorkspaceGateway,
    WorkspaceService,
    MemberService
  ]
})
export class WorkspaceModule {}
