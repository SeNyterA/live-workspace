import { createContext, ReactNode, useContext } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../../services/socket/useAppOnSocket'
import { extractApi, TMessage } from '../../../types'

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
        userId: message.createdById!,
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

  useAppOnSocket({
    key: 'reaction',
    resFunc({ reaction }) {
      console.log({ reaction })
      dispatch(
        workspaceActions.updateWorkspaceStore({
          reactions: { [`${reaction.messageId}_${reaction.userId}`]: reaction }
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
          workspaces: { [workspace.id]: workspace },
          members: __members.reduce(
            (pre, next) => ({
              ...pre,
              [`${next.workspaceId}_${next.userId}`]: next
            }),
            {}
          ),
          users: __user.reduce(
            (pre, next) => ({
              ...pre,
              ...(!!next && { [next.id]: next })
            }),
            {}
          )
        })
      )
    }
  })

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({ messages: [message] })
        )
      )
    }
  })

  const messages =
    useAppSelector(state =>
      Object.values(state.workspace.messages)
        .filter(e => targetId === e.workspaceId && e.isAvailable)
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
