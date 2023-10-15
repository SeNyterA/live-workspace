import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request
} from '@nestjs/common'
import {
  CreateBoardDto,
  CreateBoardMembersDto,
  UpdateBoardDto
} from './board.dto'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/adapters/redis-io.adapter'

@Controller('workspace')
export class BoardController {
  constructor() {}

  @Get('boards/:id')
  findOne(@HttpUser() user: TJwtUser, @Param('id') id: string) {
    return 'findOne'
  }

  @Get('boards')
  findAll(@HttpUser() user: TJwtUser) {
    return 'findAll'
  }

  @Post('teams/:teamId/boards')
  create(
    @HttpUser() user: TJwtUser,
    @Body() boardPayload: CreateBoardDto,
    @Param('teamId') teamId: string
  ) {
    return 'create'
  }

  @Patch('boards/:id')
  update(
    @Param('id') id: string,
    @HttpUser() user: TJwtUser,
    @Body() boardPayload: UpdateBoardDto
  ) {
    return 'update'
  }

  @Delete('boards/:id')
  delete(@Param('id') id: string, @HttpUser() user: TJwtUser) {
    return 'delete'
  }

  @Post('boards/:id/members')
  eidtMembers(
    @Param('id') id: string,
    @HttpUser() user: TJwtUser,
    @Body() membersPayload: CreateBoardMembersDto
  ) {
    return 'eidtMembers'
  }
}
