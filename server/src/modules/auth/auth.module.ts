import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../users/user.schema'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { MailService } from '../mail/mail.service'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: SchemaFactory.createForClass(User) }
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '99999999999999s' }
    }),
    MailModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
