import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { BoardService } from './board.service'
import { Card, Member, Workspace } from '@prisma/client'

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

  @Post('boards/:boardId/cards')
  createCard(
    @HttpUser() user: TJwtUser,
    @Param('boardId') boardId: string,
    @Body() { card }: { card: Card }
  ) {
    return this.boardService.createCard({
      boardId,
      user,
      card
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

  @Patch('boards/:boardId/properies/:propertyId/options/:optionId')
  updateOption(
    @HttpUser() user: TJwtUser,
    @Param('boardId') boardId: string,
    @Param('propertyId') propertyId: string,
    @Param('optionId') optionId: string,
    @Body() { order }: { order: number }
  ) {
    return this.boardService.updateColumnPosition({
      boardId,
      user,
      optionId,
      propertyId,
      order
    })
  }
}
