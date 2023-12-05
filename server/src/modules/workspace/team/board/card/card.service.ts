import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Errors } from 'src/libs/errors'
import { UsersService } from 'src/modules/users/users.service'
import { MemberService } from 'src/modules/workspace/member/member.service'
import { MessageService } from 'src/modules/workspace/message/message.service'
import { WorkspaceService } from 'src/modules/workspace/workspace.service'
import { TeamService } from '../../team.service'
import { BoardService } from '../board.service'
import { CardDto } from './card.dto'
import { Card } from './card.schema'

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) readonly cardModel: Model<Card>,

    readonly memberService: MemberService,
    @Inject(forwardRef(() => MessageService))
    readonly messageService: MessageService,
    @Inject(forwardRef(() => WorkspaceService))
    readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => TeamService))
    readonly teamService: TeamService,
    @Inject(forwardRef(() => UsersService))
    readonly usersService: UsersService,
    @Inject(forwardRef(() => BoardService))
    readonly boardService: BoardService
  ) {}

  async _create({
    userId,
    boardId,
    payload
  }: {
    userId: string
    boardId: string
    payload: CardDto
  }) {
    const {
      permissions: {
        fieldAction: { create: createPermission }
      }
    } = await this.boardService.__getPermisstion({
      targetId: boardId,
      userId
    })

    if (!createPermission) {
      return {
        error: {
          code: Errors['User dont has permission to create card'],
          err: 'User dont has permission to create card',
          userId,
          boardId
        }
      }
    }

    const newCard = await this.cardModel.create({
      ...payload,
      boardId,
      createdById: userId,
      modifiedById: userId
    })

    this.workspaceService.boardEmit({
      rooms: [boardId],
      boardData: [{ type: 'card', action: 'create', data: newCard.toJSON() }]
    })

    return {
      data: newCard
    }
  }

  async _update({
    userId,
    boardId,
    payload,
    cardId
  }: {
    userId: string
    boardId: string
    cardId: string
    payload: CardDto
  }) {
    const {
      permissions: {
        fieldAction: { edit: editPermission }
      }
    } = await this.boardService.__getPermisstion({
      targetId: boardId,
      userId
    })

    if (!editPermission) {
      return {
        error: {
          code: Errors['User dont has permission to edit card'],
          err: 'User dont has permission to edit card',
          userId,
          boardId
        }
      }
    }

    const updatedCard = await this.cardModel.findOneAndUpdate(
      {
        boardId,
        _id: cardId
      },
      {
        ...payload,
        modifiedById: userId,
        updatedAt: new Date()
      },
      {
        new: true,
        upsert: true,
        lean: true
      }
    )

    this.workspaceService.boardEmit({
      rooms: [boardId],
      boardData: [{ type: 'card', action: 'update', data: updatedCard }]
    })

    return {
      data: updatedCard
    }
  }
}
