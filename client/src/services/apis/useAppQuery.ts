import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { TUser } from '../../types/user.type'
import {
  TChannel,
  TDirect,
  TGroup,
  TMember,
  TMessage,
  TTeam
} from '../../types/workspace.type'
import { replaceDynamicValues } from './common'
import http from './http'

type ApiQueryType = {
  base: {
    url: {
      baseUrl: '/auth/profile'
      urlParams: {
        section: string
        userId: string
        boardId: string
      }
      queryParams: {
        param1: string
        param2: string
      }
    }
    response: TUser
  }

  login: {
    url: {
      baseUrl: '/auth/profile'
    }
    response: TUser
  }

  //workspace
  workspace: {
    url: {
      baseUrl: '/workspace'
    }
    response: {
      teams: {
        teams: TTeam[]
        members: TMember[]
      }
      channels: {
        channels: TChannel[]
        members: TMember[]
      }
      groups: {
        groups: TGroup[]
        members: TMember[]
      }
      directs: {
        directs: TDirect[]
        directUserId: string[]
      }
      users: TUser[]
    }
  }

  targetMembers: {
    url: {
      baseUrl: '/workspace/members/:targetId'
      urlParams: {
        targetId: string
      }
      queryParams?: {
        includeUsers?: boolean
      }
    }
    response: {
      members: TMember[]
      users: TUser[]
    }
  }

  channelMessages: {
    url: {
      baseUrl: '/workspace/channels/:channelId/messages'
      urlParams: {
        channelId: string
      }
    }
    response: {
      messages: TMessage[]
      total: number
    }
  }

  directMessages: {
    url: {
      baseUrl: '/workspace/direct-messages/:directId/messages'
      urlParams: {
        directId: string
      }
    }
    response: {
      messages: TMessage[]
      total: number
    }
  }

  findUsersByKeyword: {
    url: {
      baseUrl: '/users/by-keyword'
      queryParams: {
        keyword: string
        page?: number
        pageSize?: number
      }
    }
    response: {
      users: TUser[]
    }
  }

  findUserByUserName: {
    url: {
      baseUrl: '/user/by-username/:userName'
      urlParams: {
        userName: string
      }
    }
    response: {
      user: TUser
    }
  }

  findDirectInfo: {
    url: {
      baseUrl: '/workspace/direct-messages'
      queryParams: {
        directId?: string
        targetEmail?: string
        targetId?: string
        targetUserName?: string
      }
    }
    response: {
      users: TUser[]
      direct: TDirect
    }
  }

  usersReadedMessage: {
    url: {
      baseUrl: '/workspace/usersReadedMessage/:targetId'
      urlParams: {
        targetId: string
      }
    }
    response: any
  }
}

export const useAppQuery = <T extends keyof ApiQueryType>({
  url,
  options
}: Omit<ApiQueryType[T], 'response'> & { key: T } & {
  options?: Omit<UseQueryOptions<ApiQueryType[T]['response']>, 'queryFn'>
}) => {
  const queryParams = new URLSearchParams((url as any)?.queryParams).toString()

  const urlApi = `${replaceDynamicValues(
    url.baseUrl,
    (url as any)?.urlParams || {}
  )}`
  const requestKey = `${urlApi}${queryParams ? `?${queryParams}` : ''}`

  const data = useQuery({
    ...options,
    queryKey: [requestKey, options?.queryKey],
    queryFn: async (): Promise<ApiQueryType[T]['response']> => {
      const response = await http.get(urlApi, {
        params: (url as any)?.queryParams
      })
      return response.data
    }
  })
  return data
}
