import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { WorkspaceService } from './workspace.service'
import { TeamController } from './team.controler'

@Module({
  imports: [TypeOrmModule.forFeature([User, Member, Workspace])],
  controllers: [TeamController],
  providers: [WorkspaceService]
})
export class WorkspaceModule {}
