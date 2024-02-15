import { Body, Controller, Param, Patch, Post, Query } from '@nestjs/common'
import { HttpUser } from 'src/decorators/users.decorator'
import { MessageService } from 'src/modules/workspace/message/message.service'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { BlockDto, CardDto } from './card.dto'
import { CardService } from './card.service'

@Controller('workspace/boards/:boardId')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly messageService: MessageService
  ) {}

  @Post('/cards')
  async create(
    @HttpUser() user: TJwtUser,
    @Body() payload: CardDto,
    @Param('boardId') boardId: string
  ) {
    return this.cardService._create({
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
    return this.cardService._update({
      boardId,
      payload,
      userId: user.sub,
      cardId
    })
  }

  @Post('/cards/:cardId/blocks')
  async createBlock(
    @HttpUser() user: TJwtUser,
    @Body() payload: BlockDto,
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Query('index') index?: string
  ) {
    console.log(payload)
    let numericIndex: number

    if (index !== undefined) {
      numericIndex = parseInt(index, 10)
      if (isNaN(numericIndex)) {
        numericIndex = -1
      }
    } else {
      numericIndex = -1
    }

    return this.cardService._createBlock({
      boardId,
      payload,
      index: numericIndex,
      userId: user.sub,
      cardId
    })
  }

  @Patch('/cards/:cardId/blocks/:blockId')
  async updateBlock(
    @HttpUser() user: TJwtUser,
    @Body() payload: BlockDto,
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Param('blockId') blockId: string
  ) {
    return this.cardService._updateBlock({
      boardId,
      payload,
      userId: user.sub,
      cardId,
      blockId
    })
  }

  @Post('/cards/:cardId/messages')
  async createMessage(
    @HttpUser() user: TJwtUser,
    @Param('boardId') boardId: string,
    @Param('cardId') cardId: string,
    @Body()
    messagePayload: any
  ) {
    return this.messageService._createForCard({
      userId: user.sub,
      boardId: boardId,
      targetId: cardId,
      messagePayload
    })
  }
}
