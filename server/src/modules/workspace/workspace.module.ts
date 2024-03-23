import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { GroupController } from './group/group.controller'
import { GroupService } from './group/group.service'
import { MemberController } from './member/member.controler'
import { MemberService } from './member/member.service'
import { BoardController } from './team/board/board.controller'
import { BoardService } from './team/board/board.service'
import { ChannelController } from './team/channel/channel.controller'
import { ChannelService } from './team/channel/channel.service'
import { TeamController } from './team/team.controler'
import { TeamService } from './team/team.service'
import { WorkspaceController } from './workspace.controller'
import { WorkspaceService } from './workspace.service'

@Module({
  imports: [PrismaModule],
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
