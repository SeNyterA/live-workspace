import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { RedisModule } from '../redis/redis.module'
import { WorkspaceModule } from '../workspace/workspace.module'
import { SocketGateway } from './socket.gateway'

@Module({
  imports: [WorkspaceModule, RedisModule, PrismaModule],
  controllers: [],
  providers: [SocketGateway]
})
export class SocketModule {}
