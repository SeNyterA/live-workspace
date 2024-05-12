import { TMember, TWorkspace, TWorkspaceExtra } from '../../../types'

export type TChannelMutationApi = {
  createChannel: {
    url: {
      baseUrl: '/teams/:teamId/channels'
      urlParams: {
        teamId: string
      }
    }
    method: 'post'
    payload: {
      workspace: TWorkspace
      members?: Pick<TMember, 'userId' | 'role'>[]
    }
    response: TWorkspaceExtra
  }
}
