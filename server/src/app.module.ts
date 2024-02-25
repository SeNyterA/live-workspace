import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { AuthGuard } from './modules/auth/auth.guard'
import { AuthModule } from './modules/auth/auth.module'
import { MailModule } from './modules/mail/mail.module'
import { SocketModule } from './new-modules/socket/socket.module'
import { WorkspaceModule } from './new-modules/workspace/workspace.module'
import { RedisModule } from './new-modules/redis/redis.module'
import { MessageModule } from './new-modules/workspace/message/message.module'
import { AWSModule } from './new-modules/aws/aws.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    MailModule,
    MessageModule,
    WorkspaceModule,
    SocketModule,
    RedisModule,
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
