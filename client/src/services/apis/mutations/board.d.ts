import { TMember, TWorkspace } from '../../../types'

export type TBoardlMutationApi = {
  createBoard: {
    url: {
      baseUrl: '/teams/:teamId/boards'
      urlParams: {
        teamId: string
      }
    }
    method: 'post'
    payload: { workspace: TWorkspace; members?: TMember[] }
    response: { group: TWorkspace }
  }
}
