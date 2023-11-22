import { useMutation } from '@tanstack/react-query'
import { TMemberDto } from '../../types/dto.type'
import { TUser } from '../../types/user.type'
import {
  EMemberRole,
  TChannelPayload,
  TMember,
  TMessage,
  TWorkspace,
  TWorkspacePlayload
} from '../../types/workspace.type'
import { replaceDynamicValues } from './common'
import http from './http'

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

  createTeam: {
    url: {
      baseUrl: '/workspace/teams'
    }
    method: 'post'
    payload: TWorkspacePlayload
    response: TWorkspace
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

  createChannel: {
    url: {
      baseUrl: '/workspace/teams/:teamId/channels'
      urlParams: {
        teamId: string
      }
    }
    method: 'post'
    payload: TChannelPayload
    response: TWorkspace
  }

  createChannelMessage: {
    url: {
      baseUrl: '/workspace/channels/:channelId/messages'
      urlParams: {
        channelId: string
      }
    }
    method: 'post'
    payload: { content: string }
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

  createGroup: {
    url: {
      baseUrl: '/workspace/direct-messages/:targetId/messages'
      urlParams: {
        targetId: string
      }
    }
    method: 'post'
    payload: {
      title: string
      description?: string
      avatar?: string
      members?: TMemberDto[]
    }
    response: TMessage
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
