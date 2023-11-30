import { createContext, ReactNode, useContext } from 'react'
import { TParams } from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import { EMessageType, TMessage } from '../../types/workspace.type'

export type TTargetMessageId = Partial<
  Pick<TParams, 'channelId' | 'groupId' | 'directId'>
>
export type TGroupedMessage = {
  userId: string
  messages: TMessage[]
  type: EMessageType
}

export type TMessageContentValue = {
  title: string
  messages: TMessage[]
  groupedMessages: TGroupedMessage[]
  targetId: TTargetMessageId
  userTargetId?: string
}
const messageContentContext = createContext<TMessageContentValue>({
  messages: [],
  groupedMessages: [],
  targetId: {},
  title: ''
})

export const useMessageContent = () => useContext(messageContentContext)

export default function MessageContentProvider({
  children,
  value
}: {
  value: Omit<TMessageContentValue, 'messages' | 'groupedMessages'>
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

  return (
    <messageContentContext.Provider
      value={{
        ...value,
        messages,
        groupedMessages: groupMessages(messages)
      }}
    >
      {children}
    </messageContentContext.Provider>
  )
}

export const groupMessages = (messages: TMessage[]): TGroupedMessage[] => {
  const groupedMessages: TGroupedMessage[] = []
  let currentGroup: TGroupedMessage | null = null

  messages.forEach(message => {
    if (
      currentGroup &&
      currentGroup.type === message.messageType &&
      currentGroup.userId === message.createdById
    ) {
      currentGroup.messages.push(message)
    } else {
      currentGroup = {
        userId: message.createdById,
        messages: [message],
        type: message.messageType
      }
      groupedMessages.push(currentGroup)
    }
  })

  return groupedMessages
}
