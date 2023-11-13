import { Controller, Get, Param, Query } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get('users/by-keyword')
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10
  ) {
    return this.userService.findByKeyword(keyword, page, pageSize)
  }

  @Get('user/by-username/:userName')
  async findByUserName(@Param('userName') userName: string) {
    return this.userService.findByUsername(userName)
  }
}
