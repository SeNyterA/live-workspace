import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { RemovePasswordMiddleware } from './middlewares/removePassword.middleware'
import { AuthGuard } from './modules/auth/auth.guard'
import { AuthModule } from './modules/auth/auth.module'
import { AWSModule } from './modules/aws/aws.module'
import { MailModule } from './modules/mail/mail.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { RedisModule } from './modules/redis/redis.module'
import { SocketModule } from './modules/socket/socket.module'
import { UserModule } from './modules/user/user.module'
import { MessageModule } from './modules/workspace/message/message.module'
import { WorkspaceModule } from './modules/workspace/workspace.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    MailModule,
    MessageModule,
    WorkspaceModule,
    SocketModule,
    RedisModule,
    AWSModule,
    PrismaModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RemovePasswordMiddleware).forRoutes('*')
  }
}
