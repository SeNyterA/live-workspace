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

@Controller('workspace')
export class BoardController {
  constructor() {}

  @Get('boards/:id')
  findOne(@Request() req, @Param('id') id: string) {
    return 'findOne'
  }

  @Get('boards')
  findAll(@Request() req) {
    return 'findAll'
  }

  @Post('teams/:teamId/boards')
  create(
    @Request() req,
    @Body() boardPayload: CreateBoardDto,
    @Param('teamId') teamId: string
  ) {
    return 'create'
  }

  @Patch('boards/:id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() boardPayload: UpdateBoardDto
  ) {
    return 'update'
  }

  @Delete('boards/:id')
  delete(@Param('id') id: string, @Request() req) {
    return 'delete'
  }

  @Post('boards/:id/members')
  eidtMembers(
    @Param('id') id: string,
    @Request() req,
    @Body() membersPayload: CreateBoardMembersDto
  ) {
    return 'eidtMembers'
  }
}
