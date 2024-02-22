import { createContext, ReactNode, useContext } from 'react'
import { TMessage } from '../../new-types/message'
import { useAppSelector } from '../../redux/store'

export type TGroupedMessage = {
  userId: string
  messages: TMessage[]
}

export type TMessageContentValue = {
  title: string
  messages: TMessage[]
  groupedMessages: TGroupedMessage[]
  targetId: string
  userTargetId?: string
}
const messageContentContext = createContext<TMessageContentValue>({
  messages: [],
  groupedMessages: [],
  targetId: '',
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
        .filter(e => targetId === e.targetId)
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
    if (currentGroup && currentGroup.userId === message.createdById) {
      currentGroup.messages.push(message)
    } else {
      currentGroup = {
        userId: message.createdById,
        messages: [message]
      }
      groupedMessages.push(currentGroup)
    }
  })

  return groupedMessages
}
