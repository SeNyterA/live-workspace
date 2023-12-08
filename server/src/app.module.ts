import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { DevtoolsModule } from '@nestjs/devtools-integration'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthGuard } from './modules/auth/auth.guard'
import { AuthModule } from './modules/auth/auth.module'
import { AWSModule } from './modules/aws/aws.module'
import { RedisModule } from './modules/redis/redis.module'
import { UsersModule } from './modules/users/users.module'
import { WorkspaceModule } from './modules/workspace/workspace.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production'
    }),
    AuthModule,
    UsersModule,
    WorkspaceModule,
    AWSModule,
    RedisModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
