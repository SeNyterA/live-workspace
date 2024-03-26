import { TCard, TCardExtra, TPropertyOption } from '../../../types'

export type TBoardApi = {
  muations: {
    updateColumnPosition: {
      url: {
        baseUrl: 'boards/:boardId/properies/:propertyId/options/:optionId'
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
  }
  queries: {}
}
