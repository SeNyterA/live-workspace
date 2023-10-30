import { useEffect } from 'react'
import { TMessage } from '../../types/workspace.type'
import { useSocketContext } from './SocketProvider'

type ApiSocketType = {
  message: {
    response: {
      message: TMessage
      action: 'create' | 'update' | 'delete'
    }
  }
  startTyping: {
    response: {
      targetId: string
      userId: string
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
