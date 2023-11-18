import { useDocumentVisibility } from '@mantine/hooks'
import { createContext, ReactNode, useContext, useEffect } from 'react'
import { TParams } from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import { TMessage } from '../../types/workspace.type'

export type TTargetMessageId = Partial<
  Pick<TParams, 'channelId' | 'groupId' | 'directId'>
>

type TMessageContentValue = {
  title: string
  messages: TMessage[]
  targetId: TTargetMessageId
  userTargetId?: string
}
const messageContentContext = createContext<TMessageContentValue>({
  messages: [],
  targetId: {},
  title: ''
})

export const useMessageContent = () => useContext(messageContentContext)

export default function MessageContentProvider({
  children,
  value
}: {
  value: Omit<TMessageContentValue, 'messages'>
  children: ReactNode
}) {
  const { targetId } = value
  const messages =
    useAppSelector(state =>
      Object.values(state.workspace.messages)
        .filter(
          e =>
            (targetId.channelId || targetId.directId || targetId.groupId) ===
            e.messageReferenceId
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    ) || []

  const isVisible = useDocumentVisibility()
  const emitSocket = useAppEmitSocket()

  useEffect(() => {
    if (messages.length > 0) {
      const lastMess = messages[messages.length - 1]
      const _targetId =
        targetId.channelId || targetId.directId || targetId.groupId

      if (_targetId && isVisible)
        emitSocket({
          key: 'makeReadMessage',
          messageId: lastMess._id,
          targetId: _targetId
        })
    }
  }, [messages])

  return (
    <messageContentContext.Provider
      value={{
        ...value,
        messages
      }}
    >
      {children}
    </messageContentContext.Provider>
  )
}
