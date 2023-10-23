import { useMutation } from '@tanstack/react-query'
import { TUser } from '../../types/user.type'
import { replaceDynamicValues } from './common'
import http from './http'

type ApiMutationType = {
  login: {
    url: {
      baseUrl: '/auth/login'
    }
    method: 'post'
    payload: {
      userNameOrEmail: string
      password: string
    }
    response: {
      user: TUser
      token: string
    }
  }
}

export const useAppMutation = <T extends keyof ApiMutationType>(_key: T) => {
  const mutation = useMutation({
    mutationFn: async ({
      payload,
      method,
      url
    }: Omit<ApiMutationType[T], 'response'>): Promise<
      ApiMutationType[T]['response']
    > => {
      const _url = replaceDynamicValues(
        url.baseUrl,
        (url as any)?.urlParams || {}
      )
      const response = await http[method](_url, payload)
      return response.data
    }
  })

  return mutation
}
