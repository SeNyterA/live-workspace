import { Controller, Get, Query } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10
  ) {
    return this.userService.findByKeyword(keyword, page, pageSize)
  }
}
