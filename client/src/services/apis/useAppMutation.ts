import { useMutation } from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'
import { TChannelDto, TGroupDto, TTeamDto } from '../../types/dto.type'
import { TUser } from '../../types/user.type'
import {
  EMemberRole,
  TMember,
  TMessage,
  TWorkspace
} from '../../types/workspace.type'
import { TBoardMutionApi } from './board/board.api'
import { replaceDynamicValues } from './common'
import http from './http'
import { TUploadMutionApi } from './upload/upload.api'

const objectToFormData = (obj: any): FormData => {
  const formData = new FormData()

  for (const key in obj) {
    if (obj?.hasOwnProperty(key)) {
      const value = obj[key]

      if (value instanceof File) {
        formData?.append(key, value)
      } else if (Array?.isArray(value)) {
        value?.forEach((item, index) => {
          if (item instanceof File) {
            formData?.append(`${key}[${index}]`, item)
          } else {
            formData?.append(`${key}[${index}]`, item?.toString())
          }
        })
      } else if (typeof value === 'object' && value !== null) {
        for (const nestedKey in value) {
          if (value?.hasOwnProperty(nestedKey)) {
            const nestedValue = value[nestedKey]
            if (nestedValue instanceof File) {
              formData?.append(`${key}[${nestedKey}]`, nestedValue)
            } else {
              formData?.append(`${key}[${nestedKey}]`, nestedValue?.toString())
            }
          }
        }
      } else {
        formData?.append(key, value?.toString())
      }
    }
  }

  return formData
}

export type ApiMutationType = {
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
  register: {
    url: {
      baseUrl: '/auth/register'
    }
    method: 'post'
    payload: {
      email: string
      userName: string
      password: string
    }
    response: {
      user: TUser
      token: string
    }
  }

  editTeamMemberRole: {
    url: {
      baseUrl: '/workspace/teams/:teamId/members/:memberId'
      urlParams: {
        teamId: string
        memberId: string
      }
    }
    method: 'patch'
    payload: { role: EMemberRole }
    response:
      | {
          success: true
          data: TMember
        }
      | { success: false; error: string }
  }

  createChannelMessage: {
    url: {
      baseUrl: '/workspace/channels/:channelId/messages'
      urlParams: {
        channelId: string
      }
    }
    method: 'post'
    payload: { content: string; attachments?: string[] }
    response: TMessage
  }

  createDirectMessage: {
    url: {
      baseUrl: '/workspace/direct-messages/:targetId/messages'
      urlParams: {
        targetId: string
      }
    }
    method: 'post'
    payload: { content: string }
    response: TMessage
  }

  createGroupMessage: {
    url: {
      baseUrl: '/workspace/groups/:groupId/messages'
      urlParams: {
        groupId: string
      }
    }
    method: 'post'
    payload: { content: string }
    response: TMessage
  }

  createGroup: {
    url: {
      baseUrl: '/workspace/groups'
    }
    method: 'post'
    payload: TGroupDto
    response: TMessage
  }

  createTeam: {
    url: {
      baseUrl: '/workspace/teams'
    }
    method: 'post'
    payload: TTeamDto
    response: TWorkspace
  }

  createChannel: {
    url: {
      baseUrl: '/workspace/teams/:teamId/channels'
      urlParams: {
        teamId: string
      }
    }
    method: 'post'
    payload: TChannelDto
    response: TWorkspace
  }
} & TBoardMutionApi &
  TUploadMutionApi

export const useAppMutation = <T extends keyof ApiMutationType>(
  _key: T,
  config?: AxiosRequestConfig<ApiMutationType[T]['payload']>
) => {
  const mutation = useMutation({
    mutationFn: async ({
      payload,
      method,
      url,
      isFormData
    }: Omit<ApiMutationType[T], 'response'> & {
      isFormData?: boolean
    }): Promise<ApiMutationType[T]['response']> => {
      const _url = replaceDynamicValues(
        url.baseUrl,
        (url as any)?.urlParams || {}
      )
      const response = await http[method](
        _url,
        isFormData ? objectToFormData(payload) : payload,
        config
      )

      return response.data
    }
  })

  return mutation
}
