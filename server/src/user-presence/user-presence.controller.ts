import { Body, Controller, Get, Param, Post } from '@nestjs/common'
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
}
