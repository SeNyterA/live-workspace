import { TMember } from '../../../new-types/member.d'
import { TWorkspace } from '../../../new-types/workspace'

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
