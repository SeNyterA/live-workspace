import { TMember } from '../../../types/member'

export type TMemberApi = {
  muations: {
    acceptInvition: {
      url: {
        baseUrl: '/members/:memberId/accept-invition'
        urlParams: {
          memberId: string
        }
      }
      method: 'post'
      response: { member: TMember }
    }
    declineInvition: {
      url: {
        baseUrl: '/members/:memberId/decline-invition'
        urlParams: {
          memberId: string
        }
      }
      method: 'post'
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
