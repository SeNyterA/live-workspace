import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { TUser } from '../../types/user.type'
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
      teams: any[]
      channels: any[]
      groups: any[]
    }
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
