import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import {
  TFileExtra,
  TMemberExtra,
  TMessageExtra,
  TUserExtra,
  TWorkspaceExtra
} from '../../types'
import { replaceDynamicValues } from './common'
import http from './http'
import { TMemberApi } from './mutations/member.api'

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
    response: TUserExtra
  }

  login: {
    url: {
      baseUrl: '/auth/profile'
    }
    response: TUserExtra
  }

  verify: {
    url: {
      baseUrl: '/auth/verify'
      queryParams: {
        token: string
      }
    }
    response: TUserExtra
  }

  //workspace
  workspace: {
    url: {
      baseUrl: '/workspaces/:workspaceId'
      urlParams: {
        workspaceId: string
      }
    }
    response: { workspace: TWorkspaceExtra; members: TMemberExtra[] }
  }

  workspaces: {
    url: {
      baseUrl: '/workspaces'
    }
    response: TWorkspaceExtra[]
  }

  workspaceFiles: {
    url: {
      baseUrl: '/workspaces/:workspaceId/files'
      urlParams: {
        workspaceId: string
      }
    }
    response: TFileExtra[]
  }

  board: {
    url: {
      baseUrl: '/boards/:boardId'
      urlParams: {
        boardId: string
      }
    }
    response: TWorkspaceExtra
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
      members: TMemberExtra[]
      users: TUserExtra[]
    }
  }

  workpsaceMessages: {
    url: {
      baseUrl: 'workspaces/:workspaceId/messages'
      urlParams: {
        workspaceId: string
      }
      queryParams?: {
        fromId?: string
        size?: number
      }
    }
    response: {
      messages: TMessageExtra[]
      isCompleted: boolean
    }
  }

  workpsacePinedMessages: {
    url: {
      baseUrl: 'workspaces/:workspaceId/messages/pined'
      urlParams: {
        workspaceId: string
      }
    }
    response: TMessageExtra[]
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
      users: TUserExtra[]
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
      user: TUserExtra
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
} & TMemberApi['queries']

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
  url,
  onSucess
}: Omit<ApiQueryType[T], 'response'> & {
  key: T
  onSucess?: (data: ApiQueryType[T]['response']) => void
}): Promise<ApiQueryType[T]['response']> => {
  const urlApi = `${replaceDynamicValues(
    url.baseUrl,
    (url as any)?.urlParams || {}
  )}`

  try {
    const response = await http.get(urlApi, {
      params: (url as any)?.queryParams
    })
    onSucess && onSucess(response.data)
    return response.data
  } catch (error) {
    console.error('Error making API request:', error)
    throw error
  }
}
