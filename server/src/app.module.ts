import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthGuard } from './modules/auth/auth.guard'
import { AuthModule } from './modules/auth/auth.module'
import { AWSModule } from './modules/aws/aws.module'

import { UsersModule } from './modules/users/users.module'
import { WorkspaceModule } from './modules/workspace/workspace.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/live-workspace'),
    AuthModule,
    UsersModule,
    WorkspaceModule,
    AWSModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
