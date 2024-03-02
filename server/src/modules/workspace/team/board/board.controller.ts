import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Card } from 'src/entities/board/card.entity'
import { Member } from 'src/entities/member.entity'
import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { BoardService } from './board.service'

@Controller()
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('teams/:teamId/boards')
  createBoard(
    @HttpUser() user: TJwtUser,
    @Param('teamId') teamId: string,
    @Body() { workspace, members }: { workspace: Workspace; members?: Member[] }
  ) {
    return this.boardService.createBoard({
      user,
      workspace,
      teamId,
      members
    })
  }

  @Get('boards/:id')
  getBoard(@HttpUser() user: TJwtUser, @Param('id') boardId: string) {
    return this.boardService.getBoardById({ user, workspaceId: boardId })
  }

  @Patch('boards/:boardId/cards/:cardId')
  updateCard(
    @HttpUser() user: TJwtUser,
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Body() { card }: { card: Card }
  ) {
    return this.boardService.updateCard({
      boardId,
      user,
      card,
      cardId
    })
  }
}
