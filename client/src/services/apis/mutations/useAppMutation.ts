import { MutationOptions, useMutation } from '@tanstack/react-query'
import { AxiosRequestConfig } from 'axios'
import { TCard, TOption } from '../../../new-types/board'
import { TMessage } from '../../../new-types/message'
import { TWorkspace } from '../../../new-types/workspace'
import { TChannelDto, TGroupDto } from '../../../types/dto.type'
import { TUser } from '../../../types/user.type'
import {
  EMemberRole,
  JSONContent,
  TMember
} from '../../../types/workspace.type'
import { TBoardMutionApi } from '../board.api'
import { replaceDynamicValues } from '../common'
import http from '../http'
import { TUploadMutionApi } from '../upload.api'
import { TGroupMutationApi } from './group'

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
  verify: {
    url: {
      baseUrl: '/auth/verify'
    }
    method: 'post'
    payload: {
      token: string
    }
    response: {
      user: TUser
      token: string
    }
  }

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
  loginWithSocial: {
    url: {
      baseUrl: '/auth/loginWithSocial'
    }
    method: 'post'
    payload: {
      token: string
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
    payload: {
      content?: JSONContent
      attachments?: string[]
      replyToMessageId?: string
      replyRootId?: string
    }
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
    payload: { content?: JSONContent; attachments?: string[] }
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
    payload: { content?: JSONContent; attachments?: string[] }
    response: TMessage
  }

  createTeam: {
    url: {
      baseUrl: '/teams'
    }
    method: 'post'
    payload: {
      workspace: TWorkspace
      channels?: TWorkspace[]
      boards?: TWorkspace[]
      members?: TMember[]
    }
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

  sendWorkspaceMessage: {
    url: {
      baseUrl: '/workspaces/:workspaceId/messages'
      urlParams: {
        workspaceId: string
      }
    }
    method: 'post'
    payload: {
      message: TMessage
      replyToId?: string
      threadId?: string
    }
    response: TMessage
  }

  deleteWorkspaceMessage: {
    url: {
      baseUrl: '/workspaces/:workspaceId/messages/:messageId'
      urlParams: {
        workspaceId: string
        messageId: string
      }
    }
    method: 'delete'
    response: TMessage
  }

  pinWorkspaceMessage: {
    url: {
      baseUrl: '/workspaces/:workspaceId/messages/:messageId/pin'
      urlParams: {
        workspaceId: string
        messageId: string
      }
    }
    method: 'post'
    response: TMessage
  }

  reactWorkspaceMessage: {
    url: {
      baseUrl: '/workspaces/:workspaceId/messages/:messageId/reaction'
      urlParams: {
        messageId: string
        workspaceId: string
      }
    }
    method: 'post'
    payload: { reaction: any }
    response: TMessage
  }

  updateOption: {
    url: {
      baseUrl: 'boards/:boardId/options/:optionId'
      urlParams: {
        boardId: string
        optionId: string
      }
    }
    method: 'patch'
    payload: { option: TOption }
    response: TOption
  }

  updateCard: {
    url: {
      baseUrl: 'boards/:boardId/cards/:cardId'
      urlParams: {
        boardId: string
        cardId: string
      }
    }
    method: 'patch'
    payload: { card: TCard }
    response: TCard
  }
} & TBoardMutionApi &
  TUploadMutionApi &
  TGroupMutationApi

export const useAppMutation = <T extends keyof ApiMutationType>(
  _key: T,
  options?: {
    config?: AxiosRequestConfig
    mutationOptions?: MutationOptions<
      ApiMutationType[T]['response'],
      unknown,
      Omit<ApiMutationType[T], 'response'> & { isFormData?: boolean },
      unknown
    >
  }
) => {
  const mutation = useMutation({
    mutationFn: async ({
      method,
      url,
      isFormData,
      ...rest
    }: Omit<ApiMutationType[T], 'response'> & {
      isFormData?: boolean
    }): Promise<ApiMutationType[T]['response']> => {
      const _url = replaceDynamicValues(
        url.baseUrl,
        (url as any)?.urlParams || {}
      )
      const response = await http[method](
        _url,
        isFormData
          ? objectToFormData((rest as any).payload)
          : (rest as any).payload,
        options?.config
      )

      return response.data
    },
    ...options?.mutationOptions
  })

  return mutation
}
