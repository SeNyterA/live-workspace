import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { UsersModule } from './users/users.module';
import { CardModule } from './card/card.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/live-workspace'),
    AuthModule,
    UsersModule,
    BoardModule,
    CardModule,
    WorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
