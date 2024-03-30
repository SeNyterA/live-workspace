import {
  TCard,
  TCardExtra,
  TMember,
  TProperty,
  TPropertyExtra,
  TPropertyOption,
  TPropertyOptionExtra,
  TWorkspace,
  TWorkspaceExtra
} from '../../../types'

export type TBoardApi = {
  muations: {
    createBoard: {
      url: {
        baseUrl: '/teams/:teamId/boards'
        urlParams: {
          teamId: string
        }
      }
      method: 'post'
      payload: { workspace: TWorkspace; members?: TMember[] }
      response: TWorkspaceExtra
    }

    createCard: {
      url: {
        baseUrl: 'boards/:boardId/cards'
        urlParams: {
          boardId: string
        }
      }
      payload: { card: Partial<TCard> }
      method: 'post'
      response: TCardExtra
    }

    createProperty: {
      url: {
        baseUrl: '/boards/:boardId/properties'
        urlParams: {
          boardId: string
        }
      }
      method: 'post'
      payload: Partial<TProperty>
      response: TPropertyExtra
    }

    updateProperty: {
      url: {
        baseUrl: '/boards/:boardId/properties/:propertyId'
        urlParams: {
          boardId: string
          propertyId: string
        }
      }
      method: 'patch'
      payload: Partial<TProperty>
      response: TPropertyExtra
    }

    createOption: {
      url: {
        baseUrl: 'boards/:boardId/properties/:propertyId/options'
        urlParams: {
          boardId: string
          propertyId: string
        }
      }
      payload: Partial<TPropertyOption>
      method: 'post'
      response: TPropertyOptionExtra
    }

    updateOption: {
      url: {
        baseUrl: 'boards/:boardId/properties/:propertyId/options/:optionId'
        urlParams: {
          boardId: string
          propertyId: string
          optionId: string
        }
      }
      payload: Partial<TPropertyOption>
      method: 'patch'
      response: TPropertyOptionExtra
    }

    updateColumnPosition: {
      url: {
        baseUrl: 'boards/:boardId/properies/:propertyId/options/:optionId/order'
        urlParams: {
          boardId: string
          propertyId: string
          optionId: string
        }
      }
      payload: { order: number }
      method: 'patch'
      response: TPropertyOption
    }
  }
  queries: {}
}
