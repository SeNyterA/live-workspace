import { TBoard, TCard, TProperty } from '../../../types/workspace.type'

export type TcardDto = {
  title: string
  data: { [key: string]: string | string[] | undefined }
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
  createCard: {
    url: {
      baseUrl: '/workspace/boards/:boardId/cards'
      urlParams: {
        boardId: string
      }
    }
    method: 'post'
    payload: TcardDto
    response: any
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
