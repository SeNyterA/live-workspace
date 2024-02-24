import { on } from 'events'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { TMember } from '../../new-types/member'
import { TMessage } from '../../new-types/message'
import { TWorkspace } from '../../new-types/workspace'
import { TUser } from '../../types/user.type'
import { TDirect } from '../../types/workspace.type'
import { TBoardQueryApi } from './board.api'
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

  verify: {
    url: {
      baseUrl: '/auth/verify'
      queryParams: {
        token: string
      }
    }
    response: TUser
  }

  //workspace
  workspace: {
    url: {
      baseUrl: '/workspaces/:workspaceId'
      urlParams: {
        workspaceId: string
      }
    }
    response: { workspace: TWorkspace; members: TMember[] }
  }

  workspaces: {
    url: {
      baseUrl: '/workspaces'
    }
    response: TWorkspace[]
  }

  board: {
    url: {
      baseUrl: '/boards/:boardId'
      urlParams: {
        boardId: string
      }
    }
    response: TWorkspace
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

  workpsaceMessages: {
    url: {
      baseUrl: 'workspaces/:workspaceId/messages'
      urlParams: {
        workspaceId: string
      }
    }
    response: {
      messages: TMessage[]
      remainingCount: number
    }
  }

  workpsacePinedMessages: {
    url: {
      baseUrl: 'workspaces/:workspaceId/messages/pined'
      urlParams: {
        workspaceId: string
      }
    }
    response: TMessage[]
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
  getUnreadCounts: {
    url: {
      baseUrl: 'workspace/getUnreadCounts'
    }
    response: { [targetId: string]: number }
  }
} & TBoardQueryApi

export const useAppQuery = <T extends keyof ApiQueryType>({
  url,
  options,
  onSucess
}: Omit<ApiQueryType[T], 'response'> & { key: T } & {
  options?: Omit<
    UseQueryOptions<ApiQueryType[T]['response']>,
    'queryFn' | 'queryKey'
  > & { queryKey?: string[] | string }
  onSucess?: (data: ApiQueryType[T]['response']) => void
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
      onSucess && onSucess(response.data)
      return response.data
    }
  })

  return data
}

export const appGetFn = async <T extends keyof ApiQueryType>({
  url
}: Omit<ApiQueryType[T], 'response'> & { key: T }): Promise<
  ApiQueryType[T]['response']
> => {
  const urlApi = `${replaceDynamicValues(
    url.baseUrl,
    (url as any)?.urlParams || {}
  )}`

  try {
    const response = await http.get(urlApi, {
      params: (url as any)?.queryParams
    })
    return response.data
  } catch (error) {
    console.error('Error making API request:', error)
    throw error
  }
}
