import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { UserController } from './user.controler'
import { UserService } from './user.servcie'

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: []
})
export class UserModule {}
