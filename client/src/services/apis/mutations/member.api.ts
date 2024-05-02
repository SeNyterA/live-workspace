import { TMember, TMemberExtra, TWorkspaceExtra } from '../../../types'

export type TMemberApi = {
  muations: {
    acceptInvition: {
      url: {
        baseUrl: '/workspaces/:workspaceId/accept-invition'
        urlParams: {
          workspaceId: string
        }
      }
      method: 'post'
      response: {
        workspaces: TWorkspaceExtra[]
        members: TMemberExtra[]
      }
    }
    declineInvition: {
      url: {
        baseUrl: '/workspaces/:workspaceId/decline-invition'
        urlParams: {
          workspaceId: string
        }
      }
      method: 'post'
      response: { member: TMember }
    }
    leaveWorkspace: {
      url: {
        baseUrl: '/workspaces/:workspaceId/members'
        urlParams: {
          workspaceId: string
        }
      }
      method: 'delete'
      response: { member: TMember }
    }
  }
  queries: {
    getInvitions: {
      url: {
        baseUrl: '/members/invitions'
      }
      response: { invitions: TMemberExtra[] }
    }
  }
}
