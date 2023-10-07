import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Channel, ChannelSchema } from './schemas/channel.schema';
import {
  DirectMessage,
  DirectMessageSchema,
} from './schemas/direct-message.schema';
import { Group, GroupSchema } from './schemas/group.schema';
import { Team, TeamSchema } from './schemas/team.schema';
import { ChannelService } from './services/channel.service';
import { DirectMessageService } from './services/direct-message.service';
import { GroupService } from './services/group.service';
import { TeamService } from './services/team.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Channel.name, schema: ChannelSchema },
      { name: DirectMessage.name, schema: DirectMessageSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  controllers: [WorkspaceController],
  providers: [
    WorkspaceService,
    ChannelService,
    TeamService,
    GroupService,
    DirectMessageService,
  ],
})
export class WorkspaceModule {}
