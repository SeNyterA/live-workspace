import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { UsersModule } from './modules/users/users.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/live-workspace'),
    AuthModule,
    UsersModule,
    BoardModule,
    WorkspaceModule,
  ],
})
export class AppModule {}
