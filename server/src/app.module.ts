import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

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
    })
    // AuthModule,
    // UsersModule,
    // WorkspaceModule,
    // AWSModule,
    // RedisModule,
    // MailModule
  ]
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: AuthGuard
  //   }
  // ]
})
export class AppModule {}
