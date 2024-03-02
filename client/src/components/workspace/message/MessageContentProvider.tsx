import { createContext, ReactNode, useContext } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { TMessage } from '../../../types'

export type TGroupedMessage = {
  userId: string
  messages: TMessage[]
}

export type TMessageContentValue = {
  messages: TMessage[]
  groupedMessages: TGroupedMessage[]
}
const messageContentContext = createContext<TMessageContentValue>({
  messages: [],
  groupedMessages: []
})

export const useMessageContent = () => useContext(messageContentContext)
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

export default function MessageContentProvider({
  children
}: {
  children: ReactNode
}) {
  const { channelId, groupId, directId } = useAppParams()
  const targetId = channelId || groupId || directId || ''
  const dispatch = useDispatch()

  const { data: workpsaceMessages, refetch } = useAppQuery({
    key: 'workpsaceMessages',
    url: {
      baseUrl: 'workspaces/:workspaceId/messages',
      urlParams: {
        workspaceId: targetId
      }
    },
    options: {
      queryKey: [targetId],
      enabled: !!targetId
    },
    onSucess({ messages, remainingCount }) {
      dispatch(
        workspaceActions.updateWorkspaceStore({
          messages: messages.reduce(
            (pre, next) => ({
              ...pre,
              [next._id]: next
            }),
            {}
          )
        })
      )
    }
  })

  useAppQuery({
    key: 'workspace',
    url: {
      baseUrl: '/workspaces/:workspaceId',
      urlParams: { workspaceId: targetId }
    },
    onSucess({ workspace, members }) {
      const _members = members.map(e => {
        const { user, ...member } = e
        return { user, member }
      })
      const __user = _members.map(e => e.user)
      const __members = _members.map(e => e.member)

      dispatch(
        workspaceActions.updateWorkspaceStore({
          workspaces: { [workspace._id]: workspace },
          members: __members.reduce(
            (pre, next) => ({
              ...pre,
              [next._id]: next
            }),
            {}
          ),
          users: __user.reduce(
            (pre, next) => ({
              ...pre,
              ...(!!next && { [next._id]: next })
            }),
            {}
          )
        })
      )
    }
  })

  const messages =
    useAppSelector(state =>
      Object.values(state.workspace.messages)
        .filter(e => targetId === e.targetId && e.isAvailable)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
    ) || []

  return (
    <messageContentContext.Provider
      value={{
        messages,
        groupedMessages: groupMessages(messages)
      }}
    >
      {children}
    </messageContentContext.Provider>
  )
}
