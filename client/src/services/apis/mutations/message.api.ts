import { TReaction } from '../../../types'

export type TMessageApi = {
  muations: {
    reactMessage: {
      url: {
        baseUrl: '/workspaces/:workspaceId/messages/:messageId/react'
        urlParams: {
          workspaceId: string
          messageId: string
        }
      }
      method: 'post'
      payload: {
        native?: string
        shortcode?: string
        unified: string
      }
      response: { reaction: TReaction }
    }
  }
  queries: {}
}
