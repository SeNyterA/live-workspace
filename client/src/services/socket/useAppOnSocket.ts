import { useEffect } from 'react'
import { TCard, TMessage, TPropertyOption, TWorkspace } from '../../types'
import { useSocketContext } from './SocketProvider'

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

  workspace: {
    response: {
      workspace: TWorkspace
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
      option: TPropertyOption
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
