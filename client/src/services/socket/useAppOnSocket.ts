import { useEffect } from 'react'
import {
  TCardExtra,
  TMessageExtra,
  TPropertyOptionExtra,
  TReaction,
  TReactionExtra,
  TWorkspaceExtra
} from '../../types'
import { useSocketContext } from './SocketProvider'

export type ApiSocketType = {
  message: {
    response: {
      message: TMessageExtra
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

  workspace: {
    response: {
      workspace: TWorkspaceExtra
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
      option: TPropertyOptionExtra
      mode: 'create' | 'update' | 'delete'
    }
  }
  card: {
    response: {
      card: TCardExtra
      mode: 'create' | 'update' | 'delete'
    }
  }
  reaction: {
    response: {
      reaction: TReactionExtra
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
