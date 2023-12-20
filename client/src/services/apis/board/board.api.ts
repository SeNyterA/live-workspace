import { TWorkspaceDto } from '../../../types/dto.type'
import {
  EBlockType,
  TBoard,
  TCard,
  TProperty
} from '../../../types/workspace.type'

export type TCardData = { [key: string]: string | string[] | undefined | null }
export type TcardDto = {
  title?: string
  data?: TCardData
}

export type TBoardDto = TWorkspaceDto & { properties?: TPropertyDto[] }

export type TBlockDto = {
  blockType?: EBlockType
  content?: string
  isCheck?: boolean
  files?: string[]
}

export enum EFieldType {
  Date = 'Date',
  Number = 'Number',
  String = 'String',
  People = 'People',
  MultiPeople = 'MultiPeople',
  Select = 'Select',
  MultiSelect = 'MultiSelect',
  Link = 'Link',
  Email = 'Email',

  // Special field
  Assignees = 'Assignees',
  DueDate = 'DueDate'
}

export type TPropertyDto = {
  title?: string
  fieldType?: EFieldType
  fieldOption?: {
    title?: string
    color?: string
  }[]
}

export type TBoardMutionApi = {
  createBoard: {
    url: {
      baseUrl: '/workspace/teams/:teamId/boards'
      urlParams: {
        teamId: string
      }
    }
    method: 'post'
    payload: TBoardDto
    response: any
  }

  createCard: {
    url: {
      baseUrl: '/workspace/boards/:boardId/cards'
      urlParams: {
        boardId: string
      }
    }
    method: 'post'
    payload: TcardDto
    response: {
      error?: {
        code: number
        err: string
        userId: string
        boardId: string
        cardId: string
      }
      data?: TCard
    }
  }

  updateCard: {
    url: {
      baseUrl: '/workspace/boards/:boardId/cards/:cardId'
      urlParams: {
        boardId: string
        cardId: string
      }
    }
    method: 'patch'
    payload: TcardDto
    response: {
      error?: {
        code: number
        err: string
        userId: string
        boardId: string
        cardId: string
      }
      data?: TCard
    }
  }

  createBlock: {
    url: {
      baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks'
      urlParams: {
        boardId: string
        cardId: string
      }
      queryParams?: { index: number }
    }
    method: 'post'
    payload: TBlockDto
    response: {
      error?: {
        code: number
        err: string
        userId: string
        boardId: string
        cardId: string
      }
      data?: TCard
    }
  }

  updateBlock: {
    url: {
      baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks/:blockId'
      urlParams: {
        boardId: string
        cardId: string
        blockId: string
      }
    }
    method: 'patch'
    payload: TBlockDto
    response: {
      error?: {
        code: number
        err: string
        userId: string
        boardId: string
        cardId: string
        blockId: string
      }
      data?: TCard
    }
  }

  createProperty: {
    url: {
      baseUrl: '/workspace/boards/:boardId/properties'
      urlParams: {
        boardId: string
      }
    }
    method: 'post'
    payload: TPropertyDto
    response: any
  }

  updateProperty: {
    url: {
      baseUrl: '/workspace/boards/:boardId/properties/:propertyId'
      urlParams: {
        boardId: string
        propertyId: string
      }
    }
    method: 'patch'
    payload: TPropertyDto
    response: {
      error?: {
        code: number
        err: string
        userId: string
        boardId: string
        cardId: string
      }
      data?: TCard
    }
  }
}

export type TBoardQueryApi = {
  base: {
    url: {
      baseUrl: '/auth/profile'
      urlParams: {
        section: string
        userId: string
        boardId: string
      }
      queryParams: {
        param1: string
        param2: string
      }
    }
    response: any
  }

  boardData: {
    url: {
      baseUrl: '/workspace/boards/:boardId'
      urlParams: {
        boardId: string
      }
    }
    response: {
      board: TBoard
      cards: TCard[]
      properties: TProperty[]
    }
  }
}
