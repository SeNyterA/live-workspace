import { Module } from '@nestjs/common'
import { RedisModule } from '../redis/redis.module'
import { WorkspaceModule } from '../workspace/workspace.module'
import { SocketGateway } from './socket.gateway'

@Module({
  imports: [WorkspaceModule, RedisModule],
  controllers: [],
  providers: [SocketGateway]
})
export class SocketModule {}
