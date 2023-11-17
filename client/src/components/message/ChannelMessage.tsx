import { useDocumentVisibility } from '@mantine/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { TMessages, workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import MessageContent from './MessageContent'
import MessageContentProvider from './MessageContentProvider'

export default function ChannelMessage() {
  const dispatch = useDispatch()
  const { channelId } = useAppParams()
  const isVisible = useDocumentVisibility()
  const emitSocket = useAppEmitSocket()

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))
    }
  })

  const channel = useAppSelector(state =>
    Object.values(state.workspace.channels).find(e => e._id === channelId)
  )
  const { data: channelMessages } = useAppQuery({
    key: 'channelMessages',
    url: {
      baseUrl: '/workspace/channels/:channelId/messages',
      urlParams: {
        channelId: channelId!
      }
    },
    options: {
      queryKey: [channelId],
      enabled: !!channelId
    }
  })

  useEffect(() => {
    if (channelMessages)
      dispatch(
        workspaceActions.addMessages(
          channelMessages?.messages.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as TMessages
          )
        )
      )
  }, [channelMessages])

  return (
    <MessageContentProvider
      value={{
        title: channel?.title || '',
        targetId: {
          channelId
        }
      }}
    >
      <MessageContent />
    </MessageContentProvider>
  )
}