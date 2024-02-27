import { TMember } from '../../../new-types/member'
import { TWorkspace } from '../../../new-types/workspace'

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
