import { useMutation } from '@tanstack/react-query'
import { TChannelDto, TGroupDto, TTeamDto } from '../../types/dto.type'
import { TUser } from '../../types/user.type'
import {
  EMemberRole,
  TMember,
  TMessage,
  TWorkspace
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
  createBoard: {
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
