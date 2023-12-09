import { Module } from '@nestjs/common'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { RedisModule } from '../redis/redis.module'
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
import { Board } from './team/board/board.schema'
import { BoardService } from './team/board/board.service'
import { CardController } from './team/board/card/card.controler'
import { Card } from './team/board/card/card.schema'
import { CardService } from './team/board/card/card.service'
import { PropertyController } from './team/board/property/property.controler'
import { Property } from './team/board/property/property.schema'
import { PropertyService } from './team/board/property/property.service'
import { ChannelController } from './team/channel/channel.controler'
import { Channel } from './team/channel/channel.schema'
import { ChannelService } from './team/channel/channel.service'
import { TeamController } from './team/team.controler'
import { Team } from './team/team.schema'
import { TeamService } from './team/team.service'
import { WorkpaceController } from './workspace.controler'
import { WorkspaceGateway } from './workspace.gateway'
import { WorkspaceService } from './workspace.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: SchemaFactory.createForClass(Team) },
      { name: Channel.name, schema: SchemaFactory.createForClass(Channel) },
      { name: Board.name, schema: SchemaFactory.createForClass(Board) },
      {
        name: DirectMessage.name,
        schema: SchemaFactory.createForClass(DirectMessage)
      },
      { name: Group.name, schema: SchemaFactory.createForClass(Group) },
      { name: Message.name, schema: SchemaFactory.createForClass(Message) },
      { name: Member.name, schema: SchemaFactory.createForClass(Member) },
      { name: User.name, schema: SchemaFactory.createForClass(User) },
      { name: Card.name, schema: SchemaFactory.createForClass(Card) },
      { name: Property.name, schema: SchemaFactory.createForClass(Property) }
    ]),
    UsersModule,
    RedisModule
  ],
  controllers: [
    TeamController,
    ChannelController,
    DirectMessageController,
    GroupController,
    BoardController,
    WorkpaceController,
    CardController,
    PropertyController
  ],
  providers: [
    ChannelService,
    TeamService,
    GroupService,
    DirectMessageService,
    MessageService,
    WorkspaceGateway,
    WorkspaceService,
    MemberService,
    BoardService,
    CardService,
    PropertyService
  ]
})
export class WorkspaceModule {}
