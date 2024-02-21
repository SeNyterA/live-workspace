import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { TeamController } from './team.controler'
import { WorkspaceService } from './workspace.service'
import { BoardController } from './board.controler'
import { BoardService } from './board.service'
import { Property } from 'src/entities/board/property.entity'
import { Option } from 'src/entities/board/option.entity'
import { Card } from 'src/entities/board/card.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Member, Workspace, Property, Option, Card])
  ],
  controllers: [TeamController, BoardController],
  providers: [WorkspaceService, BoardService]
})
export class WorkspaceModule {}
