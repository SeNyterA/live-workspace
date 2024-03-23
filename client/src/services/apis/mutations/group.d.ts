import { TMember, TWorkspace } from '../../../types'

export type TGroupMutationApi = {
  createGroup: {
    url: {
      baseUrl: '/groups'
    }
    method: 'post'
    payload: { workspace: TWorkspace; members?: TMember[] }
    response: { group: TWorkspace }
  }
}
