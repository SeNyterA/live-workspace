import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import {
  Card,
  Member,
  Property,
  PropertyOption,
  Workspace
} from '@prisma/client'
import { UserId } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { BoardService } from './board.service'

@Controller()
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post('teams/:teamId/boards')
  createBoard(
    @UserId() userId: string,
    @Param('teamId') teamId: string,
    @Body() { workspace, members }: { workspace: Workspace; members?: Member[] }
  ) {
    return this.boardService.createBoard({
      userId,
      workspace,
      teamId,
      members
    })
  }

  @Get('boards/:id')
  getBoard(@UserId() userId: string, @Param('id') boardId: string) {
    return this.boardService.getBoardById({ userId, workspaceId: boardId })
  }

  @Post('boards/:boardId/cards')
  createCard(
    @UserId() userId: string,
    @Param('boardId') boardId: string,
    @Body() { card }: { card: Card }
  ) {
    return this.boardService.createCard({
      boardId,
      userId,
      card
    })
  }

  @Patch('boards/:boardId/cards/:cardId')
  updateCard(
    @UserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Body() { card }: { card: Card }
  ) {
    return this.boardService.updateCard({
      boardId,
      userId,
      card,
      cardId
    })
  }

  @Post('boards/:boardId/properties/:propertyId/options')
  createOption(
    @UserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('propertyId') propertyId: string,
    @Body() option: PropertyOption
  ) {
    return this.boardService.createOption({
      boardId,
      userId,
      option,
      propertyId
    })
  }

  @Patch('boards/:boardId/properties/:propertyId/options/:optionId')
  updateOption(
    @UserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('propertyId') propertyId: string,
    @Param('optionId') optionId: string,
    @Body() option: PropertyOption
  ) {
    return this.boardService.updateOption({
      boardId,
      userId,
      option,
      propertyId,
      optionId
    })
  }

  @Patch('boards/:boardId/properies/:propertyId/options/:optionId/order')
  updateColumnPosition(
    @UserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('propertyId') propertyId: string,
    @Param('optionId') optionId: string,
    @Body() { order }: { order: number }
  ) {
    return this.boardService.updateColumnPosition({
      boardId,
      userId,
      optionId,
      propertyId,
      order
    })
  }

  @Post('boards/:boardId/properties')
  createProperty(
    @UserId() userId: string,
    @Param('boardId') boardId: string,
    @Body() property: Property
  ) {
    return this.boardService.createProperty({
      boardId,
      userId,
      property
    })
  }

  @Patch('boards/:boardId/properties/:propertyId')
  updateProperty(
    @UserId() userId: string,
    @Param('boardId') boardId: string,
    @Param('propertyId') propertyId: string,
    @Body() property: Property
  ) {
    return this.boardService.updateProperty({
      boardId,
      userId,
      property,
      propertyId
    })
  }
}
