import { TMember } from '../../../types/member'
import { TWorkspace } from '../../../types/workspace'

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
