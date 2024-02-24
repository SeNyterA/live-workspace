import { useEffect } from 'react'
import { TCard, TOption } from '../../new-types/board'
import { TMessage } from '../../new-types/message'
import { TUser } from '../../types/user.type'
import {
  TBoard,
  TChannel,
  TDirect,
  TGroup,
  TMember,
  TProperty,
  TTeam
} from '../../types/workspace.type'
import { useSocketContext } from './SocketProvider'

export type TWorkspaceSocket = {
  action?: 'create' | 'update' | 'delete'
} & (
  | { data: TChannel; type: 'channel' }
  | { data: TBoard; type: 'board' }
  | { data: TTeam; type: 'team' }
  | { data: TDirect; type: 'direct' }
  | { data: TGroup; type: 'group' }
  | { data: TMember; type: 'member' }
  | { data: TUser; type: 'user' }
)

export type TDetailBoard = {
  action: 'create' | 'update' | 'delete'
} & ({ data: TProperty; type: 'property' } | { data: TCard; type: 'card' })

export type TUserSocket = {
  data: TUser
  type: 'get' | 'update'
}

export type ApiSocketType = {
  message: {
    response: {
      message: TMessage
      action: 'create' | 'update' | 'delete'
    }
  }

  typing: {
    response: {
      targetId: string
      userId: string
      type: 1 | 0
    }
  }

  userReadedMessage: {
    response: string
  }

  workspaces: {
    response: {
      workspaces: TWorkspaceSocket[]
    }
  }

  boardData: {
    response: {
      boardData: TDetailBoard[]
    }
  }

  users: {
    response: {
      users: TUserSocket[]
    }
  }

  unReadCount: {
    response: {
      count: number
      targetId: string
    }
  }

  option: {
    response: {
      option: TOption
      mode: 'create' | 'update' | 'delete'
    }
  }
  card: {
    response: {
      card: TCard
      mode: 'create' | 'update' | 'delete'
    }
  }
}

export const useAppOnSocket = <T extends keyof ApiSocketType>({
  key,
  resFunc
}: Omit<ApiSocketType[T], 'response'> & {
  key: T
  resFunc: (data: ApiSocketType[T]['response']) => void
}) => {
  const { socket } = useSocketContext()
  useEffect(() => {
    socket?.on(key as string, resFunc)
    return () => {
      socket?.off(key)
    }
  }, [socket])
}
