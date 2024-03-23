import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from './user.servcie'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/by-keyword')
  getUsersByKeywork(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10
  ) {
    return this.userService.findByKeyword({
      keyword,
      skip: (Number(page || 1) - 1) * (Number(pageSize) || 0),
      take: Number(pageSize) || 10
    })
  }
}
