import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as crypto from 'crypto-js'
import { Card } from 'src/entities/board/card.entity'
import { Option } from 'src/entities/board/option.entity'
import { EFieldType, Property } from 'src/entities/board/property.entity'
import { EMemberRole, EMemberType, Member } from 'src/entities/member.entity'
import { User } from 'src/entities/user.entity'
import { Workspace, WorkspaceType } from 'src/entities/workspace.entity'
import { TJwtUser } from 'src/modules/workspace/workspace.gateway'
import { In, Repository } from 'typeorm'

export const generateRandomHash = (
  inputString = Math.random().toString()
): string => {
  const hash = crypto.SHA256(inputString).toString()
  const truncatedHash = hash.substring(0, 8)
  return truncatedHash
}

@Injectable()
export class BoardService {
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

  async initBoardData({ board, user }: { board: Workspace; user: TJwtUser }) {
    const properties = await this.propertyRepository.insert([
      {
        title: 'Status',
        board: { _id: board._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },

        order: 0,
        fieldType: EFieldType.Select
      },
      {
        title: 'Progress',
        board: { _id: board._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },

        order: 1,
        fieldType: EFieldType.String
      },
      {
        title: 'Assignee',
        board: { _id: board._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },

        order: 2,
        fieldType: EFieldType.People
      }
    ])

    const options = await this.optionRepository.insert([
      {
        color: '#FF0000',
        title: 'To Do',
        property: { _id: properties.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        board: { _id: board._id },
        order: 0
      },
      {
        color: '#00FF00',
        title: 'In Progress',
        property: { _id: properties.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        board: { _id: board._id },
        order: 1
      },
      {
        color: '#0000FF',
        title: 'Done',
        property: { _id: properties.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        board: { _id: board._id },
        order: 2
      },
      {
        color: '#FFFF00',
        title: 'Review',
        property: { _id: properties.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        board: { _id: board._id },
        order: 3
      },
      {
        color: '#FF00FF',
        title: 'Blocked',
        property: { _id: properties.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        board: { _id: board._id },
        order: 4
      },
      {
        color: '#008080',
        title: 'On Hold',
        property: { _id: properties.identifiers[0]._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        board: { _id: board._id },
        order: 5
      }
    ])

    const cardsData = []
    for (let i = 1; i <= 10000; i++) {
      const card = {
        title: `Task AAA${i}`,
        board: { _id: board._id },
        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        properties: {
          [properties.identifiers[0]._id]: options.identifiers[i % 6]._id,
          [properties.identifiers[1]._id]: `${(i * 10) % 100}%`,
          [properties.identifiers[2]._id]: user.sub
        }
      }

      cardsData.push(card)
    }

    const cards = await this.cardRepository.insert(cardsData)
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

    const newWorkspace = await this.workspaceRepository.save(
      this.workspaceRepository.create({
        ...workspace,
        type: WorkspaceType.Board,
        displayUrl: generateRandomHash(),

        createdBy: { _id: user.sub },
        modifiedBy: { _id: user.sub },
        parent: { _id: teamId }
      })
    )

    const member = await this.memberRepository.save(
      this.memberRepository.create({
        role: EMemberRole.Owner,
        type: EMemberType.Board,

        modifiedBy: { _id: user.sub },
        createdBy: { _id: user.sub },
        user: { _id: user.sub },
        workspace: { _id: newWorkspace._id }
      })
    )

    this.initBoardData({
      board: newWorkspace,
      user
    })

    return {
      workspace: newWorkspace,
      member
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
      relations: [
        'members',
        'members.user',
        'properties',
        'properties.options'
        // 'cards'
      ]
    })

    const cards = await this.cardRepository.find({
      where: {
        board: { _id: workspaceId }
      }
    })

    return { ...workspace, cards }
  }
}
