import { TMember } from '../../../types/member'
import { TWorkspace } from '../../../types/workspace'

export type TChannelMutationApi = {
  createChannel: {
    url: {
      baseUrl: '/teams/:teamId/channels'
      urlParams: {
        teamId: string
      }
    }
    method: 'post'
    payload: { workspace: TWorkspace; members?: TMember[] }
    response: { group: TWorkspace }
  }
}
