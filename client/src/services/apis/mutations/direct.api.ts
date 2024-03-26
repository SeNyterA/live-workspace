import { TWorkspaceExtra } from '../../../types'

export type TDirectApi = {
  muations: {
    createDirect: {
      url: {
        baseUrl: 'directs/:userTargetId'
        urlParams: {
          userTargetId: string
        }
      }
      method: 'post'
      response: TWorkspaceExtra
    }
  }
  queries: {}
}
