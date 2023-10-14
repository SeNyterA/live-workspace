import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { Public } from 'src/modules/auth/auth.guard'
import { UserPresenceService } from './user-presence.service'

@Controller('user-presence')
export class UserPresenceController {
  constructor(private readonly userPresenceService: UserPresenceService) {}

  @Public()
  @Post()
  create(@Body() data: { key: string; value: string }) {
    return this.userPresenceService.setValue(data.key, data.value)
  }

  @Public()
  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.userPresenceService.getValue(key)
  }

  @Public()
  @Get()
  findAll() {
    return this.userPresenceService.getUsersInRange(1000, 9000)
  }

  @Public()
  @Post('/unread')
  testUnred(@Body() data: { key: string; value: string }) {
    return this.userPresenceService.setUnread()
  }

  @Public()
  @Get('/unread/:key')
  getUnreadByUserId(@Param('key') key: string) {
    return this.userPresenceService.getUnreadDataForUserIndex(key)
  }

  @Public()
  @Delete('')
  deleteAllKey(@Param('key') key: string) {
    return this.userPresenceService.clearAllKeys()
  }
}
