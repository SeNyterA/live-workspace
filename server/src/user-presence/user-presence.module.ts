import { Module } from '@nestjs/common';
import { UserPresenceService } from './user-presence.service';
import { UserPresenceController } from './user-presence.controller';

@Module({
  controllers: [UserPresenceController],
  providers: [UserPresenceService]
})
export class UserPresenceModule {}
