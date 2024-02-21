import { Body, Controller, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { BoardService } from './board.service'

@Controller('teams/:teamId/boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  createBoard(
    @HttpUser() user: TJwtUser,
    @Param('teamId') teamId: string,
    @Body() { workspace }: { workspace: Workspace }
  ) {
    return this.boardService.createBoard({
      user,
      workspace,
      teamId
    })
  }
}
