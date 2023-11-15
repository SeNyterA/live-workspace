import { createContext, ReactNode, useContext } from 'react'
import { TParams } from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
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
      Object.values(state.workspace.messages).filter(
        e =>
          (targetId.channelId || targetId.directId || targetId.groupId) ===
          e.messageReferenceId
      )
    ) || []

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
