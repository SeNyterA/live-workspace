import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/modules/prisma/prisma.module'
import { MessageController } from './message.controller'
import { MessageService } from './message.service'

@Module({
  imports: [PrismaModule],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
