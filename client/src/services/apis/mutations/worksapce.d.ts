import { TWorkspace } from '../../../types'

export type TWorkspaceMutationApi = {
  updateWorkspace: {
    url: {
      baseUrl: 'workspaces/:workspaceId'
      urlParams: {
        workspaceId: string
      }
    }
    method: 'patch'
    payload: { workspace: TWorkspace }
    response: { workspace: TWorkspace }
  }
}
