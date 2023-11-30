import { Body, Controller, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from '../../workspace.gateway'
import { BoardDto } from './board.dto'
import { BoardService } from './board.service'

@Controller('workspace')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
  @Post('teams/:teamId/boards')
  create(
    @HttpUser() user: TJwtUser,
    @Body() boardDto: BoardDto,
    @Param('teamId') teamId: string
  ) {
    return this.boardService._create({
      boardDto,
      userId: user.sub,
      teamId
    })
  }
}
