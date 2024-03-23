import { TPropertyOption } from '../../../types'

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
  }
  queries: {}
}
