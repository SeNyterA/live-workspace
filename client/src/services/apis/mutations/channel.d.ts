import { TMember, TWorkspace } from '../../../types'

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
