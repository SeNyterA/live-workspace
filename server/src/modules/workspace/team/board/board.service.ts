import { Inject, Injectable, forwardRef } from '@nestjs/common'
 
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import * as crypto from 'crypto-js'
import { Server } from 'socket.io'
import { Card } from 'src/entities/board/card.entity'
import { Option } from 'src/entities/board/option.entity'
import { Property } from 'src/entities/board/property.entity'
import { Member } from 'src/entities/member.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
import { Repository } from 'typeorm'
import { TeamService } from '../team.service'
import { generateBoardData } from './board.init'

export const generateRandomHash = (
  inputString = Math.random().toString()
): string => {
  const hash = crypto.SHA256(inputString).toString()
  const truncatedHash = hash.substring(0, 8)
  return truncatedHash
}

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@Injectable()
export class BoardService {
  @WebSocketServer()
  server: Server
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,

    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,

    @Inject(forwardRef(() => TeamService))
    private readonly teamService: TeamService
  ) {}

  async initBoardData({ boardId }: { boardId: string }) {
    const { cards, options, properties } = generateBoardData({
      boardId: boardId
    })

    const _properties = await this.propertyRepository.insert(properties)
    const _options = await this.optionRepository.insert(options)
    const _cards = await this.cardRepository.insert(cards)

    return { properties: _properties, options: _options, cards: _cards }
  }

  async createBoard({
    user,
    workspace,
    teamId,
    members
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
    members?: Member[]
  }) {
    const board = await this.teamService.createChildWorkspace({
      teamId,
      type: WorkspaceType.Board,
      user,
      workspace,
      members
    })

    this.initBoardData({
      boardId: board._id
    })

    return { board: board }
  }

  async getBoardById({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    const workspace = await this.workspaceRepository.findOneOrFail({
      where: {
        _id: workspaceId,
        members: { user: { _id: user.sub, isAvailable: true } }
      },
      relations: ['properties', 'properties.options', 'avatar', 'thumbnail']
    })

    const cards = await this.cardRepository.find({
      where: {
        board: { _id: workspaceId }
      }
    })
    const members = await this.memberRepository.find({
      where: { workspace: { _id: workspaceId } },
      relations: ['user']
    })

    return { ...workspace, cards, members }
  }

  async updateOption({
    boardId,
    optionId,
    user,
    newOption
  }: {
    optionId: string
    user: TJwtUser
    boardId: string
    newOption: Option
  }) {
    const option = await this.optionRepository.findOneOrFail({
      where: {
        _id: optionId,
        board: {
          _id: boardId,
          isAvailable: true,
          members: { user: { _id: user.sub }, isAvailable: true }
        }
      }
    })
    const optionUpdate = await this.optionRepository.save({
      ...option,
      ...newOption,
      modifiedBy: { _id: user.sub }
    })

    this.server
      .to(boardId)
      .emit('option', { option: optionUpdate, mode: 'update' })

    return optionUpdate
  }

  async updateCard({
    boardId,
    card,
    user,
    cardId
  }: {
    user: TJwtUser
    card: Card
    boardId: string
    cardId: string
  }) {
    const _card = await this.cardRepository.findOneOrFail({
      where: {
        _id: cardId,
        isAvailable: true,
        board: {
          _id: boardId,
          isAvailable: true,
          members: {
            user: { _id: user.sub, isAvailable: true },
            isAvailable: true
          }
        }
      }
    })
    const cardUpdated = await this.cardRepository.save({
      ..._card,
      ...card,
      modifiedBy: { _id: user.sub }
    })

    this.server.to(boardId).emit('card', { card: cardUpdated, mode: 'update' })

    return {
      card: cardUpdated
    }
  }
}
