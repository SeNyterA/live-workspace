import { useEffect } from 'react'
import {
  TChannel,
  TDirect,
  TGroup,
  TMember,
  TMessage,
  TTeam
} from '../../types/workspace.type'
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
      action: 'create' | 'update' | 'delete'
    } & (
      | { data: TChannel; type: 'channel' }
      | { data: TTeam; type: 'board' }
      | { data: TTeam; type: 'team' }
      | { data: TDirect; type: 'direct' }
      | { data: TGroup; type: 'group' }
      | { data: TMember; type: 'member' }
    )
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
