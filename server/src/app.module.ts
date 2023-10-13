import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthGuard } from './modules/auth/auth.guard'
import { AuthModule } from './modules/auth/auth.module'
import { AWSModule } from './modules/aws/aws.module'
import { EventsModule } from './modules/events/events.module'
import { UsersModule } from './modules/users/users.module'
import { WorkspaceModule } from './modules/workspace/workspace.module'
import { UserPresenceModule } from './user-presence/user-presence.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/live-workspace'),
    AuthModule,
    UsersModule,
    WorkspaceModule,
    AWSModule,
    EventsModule,
    UserPresenceModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
