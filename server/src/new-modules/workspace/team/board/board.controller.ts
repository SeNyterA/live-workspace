import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { Workspace } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { BoardService } from './board.service'
import { Option } from 'src/entities/board/option.entity'
import { Card } from 'src/entities/board/card.entity'

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

  @Patch('boards/:boardId/options/:optionId')
  updateOption(
    @HttpUser() user: TJwtUser,
    @Param('boardId') boardId: string,
    @Param('optionId') optionId: string,
    @Body() { option }: { option: Option }
  ) {
    return this.boardService.updateOption({
      user,
      boardId,
      optionId,
      newOption: option
    })
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
