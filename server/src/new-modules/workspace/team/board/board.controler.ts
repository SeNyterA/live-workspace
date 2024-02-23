import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { BoardService } from './board.service'

@Controller()
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('teams/:teamId/boards')
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

  @Get('boards/:id')
  getBoard(@HttpUser() user: TJwtUser, @Param('id') boardId: string) {
    return this.boardService.getBoardById({ user, workspaceId: boardId })
  }
}
