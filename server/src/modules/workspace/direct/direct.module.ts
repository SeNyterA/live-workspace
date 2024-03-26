import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/modules/prisma/prisma.module'
import { DirectController } from './direct.controller'
import { DirectService } from './direct.service'

@Module({
  imports: [PrismaModule],
  controllers: [DirectController],
  providers: [DirectService]
})
export class DirectModule {}
