import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthGuard } from './modules/auth/auth.guard'
import { AuthModule } from './modules/auth/auth.module'
import { AWSModule } from './modules/aws/aws.module'
import { MailModule } from './modules/mail/mail.module'
import { RedisModule } from './modules/redis/redis.module'
import { UsersModule } from './modules/users/users.module'
import { WorkspaceModule } from './modules/workspace/workspace.module'

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
    AuthModule,
    UsersModule,
    WorkspaceModule,
    AWSModule,
    RedisModule,
    MailModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
