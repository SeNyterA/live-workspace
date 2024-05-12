import { useEffect } from 'react'
import {
  TCardExtra,
  TMessageExtra,
  TPropertyOptionExtra,
  TReactionExtra,
  TUserExtra,
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

  userPresence: {
    response: {
      [userId: string]: 'online' | 'offline'
    }
  }

  typing: {
    response: {
      targetId: string
      userId: string
      isTyping: boolean
    }
  }

  workspace: {
    response: {
      workspace: TWorkspaceExtra
      action?: 'create' | 'update' | 'delete'
    }
  }

  workspaces: {
    response: {
      workspaces: TWorkspaceExtra[]
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

  unread: {
    response: {
      workspaceId: string
      count: number
    }
  }
  checkpointMessage: {
    response: {
      userId: string
      messageId: string
      workspaceId: string
    }
  }
  user: {
    response: {
      user: TUserExtra
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
    socket?.on(key as string, (data: ApiSocketType[T]['response']) => {
      console.log(data)
      resFunc(data)
    })
    return () => {
      socket?.off(key)
    }
  }, [socket])
}
