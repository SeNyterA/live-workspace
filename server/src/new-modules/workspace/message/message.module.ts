import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Member } from 'src/entities/member.entity'
import { Message } from 'src/entities/message.entity'
import { User } from 'src/entities/user.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { MessageController } from './message.controler'
import { MessageService } from './message.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Member, Workspace, Message])],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
