import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Card } from 'src/entities/board/card.entity'
import { Option } from 'src/entities/board/option.entity'
import { Property } from 'src/entities/board/property.entity'
import { Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { RedisModule } from 'src/modules/redis/redis.module'
import { BoardController } from './team/board/board.controler'
import { BoardService } from './team/board/board.service'
import { TeamController } from './team/team.controler'
import { WorkspaceController } from './workspace.controler'
import { WorkspaceGateway } from './workspace.gateway'
import { WorkspaceService } from './workspace.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Member, Workspace, Property, Option, Card]),
    RedisModule
  ],
  controllers: [TeamController, BoardController, WorkspaceController],
  providers: [WorkspaceService, BoardService, WorkspaceGateway]
})
export class WorkspaceModule {}
