import { Body, Controller, Param, Patch, Post } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { CardDto } from './card.dto'
import { CardService } from './card.service'

@Controller('workspace/boards/:boardId')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('/cards')
  async create(
    @HttpUser() user: TJwtUser,
    @Body() payload: CardDto,
    @Param('boardId') boardId: string
  ) {
    await this.cardService._create({
      boardId,
      payload,
      userId: user.sub
    })
  }

  @Patch('/cards/:cardId')
  async update(
    @HttpUser() user: TJwtUser,
    @Body() payload: CardDto,
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string
  ) {
    await this.cardService._update({
      boardId,
      payload,
      userId: user.sub,
      cardId
    })
  }
}
