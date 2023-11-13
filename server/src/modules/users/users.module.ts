import { Module } from '@nestjs/common'
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose'
import { User } from './user.schema'
import { UsersService } from './users.service'
import { UserController } from './user.controler'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: SchemaFactory.createForClass(User) }
    ])
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UserController]
})
export class UsersModule {}
