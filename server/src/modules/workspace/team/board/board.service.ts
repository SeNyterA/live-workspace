import { ForbiddenException, Injectable } from '@nestjs/common'

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import * as crypto from 'crypto-js'
import { Server } from 'socket.io'

import {
  Card,
  Member,
  MemberRole,
  MemberStatus,
  Property,
  PropertyOption,
  PropertyType,
  Workspace,
  WorkspaceStatus,
  WorkspaceType
} from '@prisma/client'
import { Errors } from 'src/libs/errors'
import { PrismaService } from 'src/modules/prisma/prisma.service'
import { TJwtUser } from 'src/modules/socket/socket.gateway'
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
  constructor(private readonly prismaService: PrismaService) {}

  async initBoardData({ boardId }: { boardId: string }) {
    const {
      cards: _cards,
      options: _options,
      properties: _properties,
      files: _files
    } = generateBoardData({
      boardId: boardId
    })

    const properties = await this.prismaService.property.createMany({
      data: _properties as any
    })

    const options = await this.prismaService.propertyOption.createMany({
      data: _options as any
    })

    const files = await this.prismaService.file.createMany({
      data: _files as any
    })

    const cards = await this.prismaService.card.createMany({
      data: _cards.map((e, index) => ({
        ...e,
        thumbnailId: _files[index].id
      })) as any
    })
  }

  joinBoard = async ({
    boardId
  }: {
    boardId: string
    workspace: Workspace
  }) => {
    const members = await this.prismaService.member.findMany({
      where: {
        workspaceId: boardId,
        status: MemberStatus.Active
      }
    })

    const membersId = members.map(member => member.userId)
    const socket = await this.server.sockets.fetchSockets()
    socket.map(socket => {
      {
        if (membersId.includes(socket._id)) {
          return socket.join(boardId)
        }
      }
    })
  }

  async createBoard({
    user,
    workspace,
    teamId,
    members,
    isInitBoardData
  }: {
    workspace: Workspace
    user: TJwtUser
    teamId: string
    members?: Member[]
    isInitBoardData?: boolean
  }) {
    const memberOperator = await this.prismaService.member.findFirst({
      where: {
        userId: user.sub,
        workspaceId: teamId,
        status: MemberStatus.Active,
        role: MemberRole.Admin
      }
    })

    if (!memberOperator) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const board = await this.prismaService.workspace.create({
      data: {
        ...workspace,
        workspaceParentId: teamId,
        type: WorkspaceType.Board,
        createdById: user.sub,
        modifiedById: user.sub,

        members: {
          create: {
            role: MemberRole.Admin,
            userId: user.sub,
            status: MemberStatus.Active
          }
        }
      }
    })

    this.initBoardData({ boardId: board.id })

    if (board.status === WorkspaceStatus.Public) {
      const teamMembers = await this.prismaService.member.findMany({
        where: {
          status: MemberStatus.Active,
          workspaceId: teamId
        }
      })
      await this.prismaService.member.createMany({
        data: teamMembers.map(member => ({
          role: MemberRole.Member,
          status: MemberStatus.Active,
          userId: member.userId,
          workspaceId: board.id
        })),
        skipDuplicates: true
      })
    }

    this.joinBoard({
      boardId: board.id,
      workspace: board
    })

    return board
  }

  async getBoardById({
    user,
    workspaceId
  }: {
    user: TJwtUser
    workspaceId: string
  }) {
    const workspace = await this.prismaService.workspace.findUnique({
      where: {
        id: workspaceId,
        isAvailable: true,
        members: {
          some: {
            userId: user.sub,
            status: MemberStatus.Active
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              include: { avatar: true }
            }
          }
        },
        cards: {
          include: {
            thumbnail: true
          },
          where: {
            isAvailable: true
          }
        },
        properties: {
          where: {
            isAvailable: true
          },
          include: {
            options: {
              where: { isAvailable: true }
            }
          }
        }
      }
    })

    return workspace
  }

  async createProperty({
    boardId,
    user,
    property
  }: {
    boardId: string
    user: TJwtUser
    property: Property
  }) {
    const board = await this.prismaService.workspace.findFirst({
      where: {
        id: boardId,
        isAvailable: true,
        members: {
          some: {
            userId: user.sub,
            status: MemberStatus.Active
          }
        }
      }
    })

    if (!board) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const propertyCreated = await this.prismaService.property.create({
      data: {
        ...property,
        order: property?.order || new Date().getTime(),
        workspaceId: boardId,
        createdById: user.sub,
        modifiedById: user.sub
      }
    })

    this.server.to(boardId).emit('property', { property: propertyCreated })

    return propertyCreated
  }

  async createCard({
    boardId,
    user,
    card
  }: {
    boardId: string
    user: TJwtUser
    card: Card
  }) {
    const board = await this.prismaService.workspace.findUnique({
      where: {
        id: boardId,
        isAvailable: true,
        members: {
          some: {
            userId: user.sub,
            status: MemberStatus.Active
          }
        }
      }
    })

    if (!board) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const cardCreated = await this.prismaService.card.create({
      data: {
        ...card,
        order: card?.order || new Date().getTime(),
        workspaceId: boardId,
        createdById: user.sub,
        modifiedById: user.sub
      }
    })

    this.server.to(boardId).emit('card', { card: cardCreated })
    return cardCreated
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
    const cardUpdated = await this.prismaService.card.update({
      where: {
        id: cardId,
        isAvailable: true,
        workspace: {
          id: boardId,
          isAvailable: true,
          members: {
            some: {
              userId: user.sub,
              status: MemberStatus.Active
            }
          }
        }
      },
      data: {
        ...card,
        modifiedById: user.sub
      },
      include: {
        thumbnail: true
      }
    })

    this.server.to(boardId).emit('card', { card: cardUpdated })
    return cardUpdated
  }

  async updateProperty({
    boardId,
    user,
    property,
    propertyId
  }: {
    boardId: string
    user: TJwtUser
    property: Property
    propertyId: string
  }) {
    const propertyUpdated = await this.prismaService.property.update({
      where: {
        id: propertyId,
        isAvailable: true,
        workspace: {
          id: boardId,
          isAvailable: true,
          members: {
            some: {
              userId: user.sub,
              status: MemberStatus.Active
            }
          }
        }
      },
      data: {
        ...property,
        modifiedById: user.sub
      }
    })

    this.server.to(boardId).emit('property', { property: propertyUpdated })

    return propertyUpdated
  }

  async createOption({
    boardId,
    user,
    option,
    propertyId
  }: {
    boardId: string
    user: TJwtUser
    propertyId: string
    option: PropertyOption
  }) {
    const board = await this.prismaService.workspace.findUnique({
      where: {
        id: boardId,
        isAvailable: true,
        members: {
          some: {
            userId: user.sub,
            status: MemberStatus.Active
          }
        },
        properties: {
          some: {
            id: propertyId,
            isAvailable: true,
            type: {
              in: [PropertyType.Select, PropertyType.MultiSelect]
            }
          }
        }
      }
    })

    if (!board) {
      throw new ForbiddenException(Errors.PERMISSION_DENIED)
    }

    const optionCreated = await this.prismaService.propertyOption.create({
      data: {
        ...option,
        order: option.order || new Date().getTime(),
        propertyId: propertyId,
        createdById: user.sub,
        modifiedById: user.sub
      }
    })

    this.server.to(boardId).emit('option', { option: optionCreated })

    return optionCreated
  }

  async updateOption({
    boardId,
    user,
    option,
    propertyId,
    optionId
  }: {
    boardId: string
    user: TJwtUser
    propertyId: string
    option: PropertyOption
    optionId: string
  }) {
    const optionUpdated = await this.prismaService.propertyOption.update({
      where: {
        id: optionId,
        isAvailable: true,
        property: {
          id: propertyId,
          isAvailable: true,
          type: { in: [PropertyType.Select, PropertyType.MultiSelect] },
          workspace: {
            id: boardId,
            isAvailable: true,
            members: {
              some: {
                userId: user.sub,
                status: MemberStatus.Active
              }
            }
          }
        }
      },
      data: {
        ...option,
        modifiedById: user.sub
      }
    })
    this.server.to(boardId).emit('option', { option: optionUpdated })
    return optionUpdated
  }

  async updateColumnPosition({
    boardId,
    optionId,
    user,
    order,
    propertyId
  }: {
    boardId: string
    user: TJwtUser
    optionId: string
    propertyId: string
    order: number
  }) {
    const optionUpdated = await this.prismaService.propertyOption.update({
      where: {
        id: optionId,
        isAvailable: true,
        property: {
          id: propertyId,
          isAvailable: true,
          type: { in: [PropertyType.Select] },
          workspace: {
            id: boardId,
            isAvailable: true,
            members: {
              some: {
                userId: user.sub,
                status: MemberStatus.Active
              }
            }
          }
        }
      },
      data: {
        order: order,
        modifiedById: user.sub
      }
    })
    this.server.to(boardId).emit('option', { option: optionUpdated })

    return optionUpdated
  }
}
