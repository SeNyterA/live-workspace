import { TMember } from '../../../types/member'

export type TMemberApi = {
  muations: {
    acceptInvition: {
      url: {
        baseUrl: '/workspace/:workspaceId/accept-invition'
        urlParams: {
          workspaceId: string
        }
      }
      method: 'post'
      response: { member: TMember }
    }
    declineInvition: {
      url: {
        baseUrl: '/workspace/:workspaceId/decline-invition'
        urlParams: {
          workspaceId: string
        }
      }
      method: 'post'
      response: { member: TMember }
    }
    leaveWorkspace: {
      url: {
        baseUrl: '/workspace/:workspaceId/members'
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
      response: { invitions: TMember[] }
    }
  }
}