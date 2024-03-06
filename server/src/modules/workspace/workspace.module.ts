import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Card } from 'src/entities/board/card.entity'
import { Option } from 'src/entities/board/option.entity'
import { Property } from 'src/entities/board/property.entity'
import { File } from 'src/entities/file.entity'
import { Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { RedisModule } from 'src/modules/redis/redis.module'
import { GroupController } from './group/group.controller'
import { GroupService } from './group/group.service'
import { BoardController } from './team/board/board.controller'
import { BoardService } from './team/board/board.service'
import { ChannelService } from './team/channel/channel.service'
import { TeamController } from './team/team.controler'
import { TeamService } from './team/team.service'
import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'
import { ChannelController } from './team/channel/channel.controller'
import { Mention } from 'src/entities/mention.entity'
import { MemberController } from './member/member.controler'
import { MemberService } from './member/member.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Member,
      Workspace,
      Property,
      Option,
      Card,
      File,
      Mention
    ]),
    RedisModule
  ],
  controllers: [
    WorkspaceController,
    TeamController,
    BoardController,
    GroupController,
    ChannelController,
    MemberController
  ],
  providers: [
    WorkspaceService,
    TeamService,
    BoardService,
    ChannelService,
    GroupService,
    ChannelService,
    MemberService
  ],
  exports: [WorkspaceService]
})
export class WorkspaceModule {}
