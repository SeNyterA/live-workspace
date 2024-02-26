import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import * as crypto from 'crypto-js'
import { Server } from 'socket.io'
import { Card } from 'src/entities/board/card.entity'
import { Option } from 'src/entities/board/option.entity'
import { Property } from 'src/entities/board/property.entity'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import {
  Workspace,
  WorkspaceStatus,
  WorkspaceType
} from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { In, Not, Repository } from 'typeorm'
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,

    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>
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
    teamId
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
  }) {
    await this.memberRepository.findOneOrFail({
      where: {
        workspace: { _id: teamId },
        user: { _id: user.sub },
        role: In([EMemberRole.Owner, EMemberRole.Admin])
      }
    })

    const newWorkspace = await this.workspaceRepository.insert({
      ...workspace,
      type: WorkspaceType.Board,
      displayUrl: generateRandomHash(),
      createdBy: { _id: user.sub },
      modifiedBy: { _id: user.sub },
      parent: { _id: teamId }
    })

    const workpsaceMembers =
      newWorkspace.generatedMaps[0].status === WorkspaceStatus.Public
        ? await this.memberRepository.find({
            where: {
              workspace: { _id: teamId },
              isAvailable: true,
              user: { _id: Not(user.sub), isAvailable: true }
            }
          })
        : []

    const members = await this.memberRepository.insert([
      {
        role: EMemberRole.Owner,
        type: EMemberType.Board,
        user: { _id: user.sub },
        workspace: { _id: newWorkspace.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      },
      ...workpsaceMembers.map(member => ({
        role: EMemberRole.Member,
        type: EMemberType.Board,
        user: { _id: member.userId },
        workspace: { _id: newWorkspace.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub }
      }))
    ])

    this.initBoardData({
      boardId: newWorkspace.identifiers[0]._id
    })

    return {
      workspace: newWorkspace,
      members
    }
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
      relations: ['properties', 'properties.options']
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

    return cardUpdated
  }
}
