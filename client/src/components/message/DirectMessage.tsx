import { useDocumentVisibility } from '@mantine/hooks'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import useDirect from '../../hooks/useDirect'
import { TMessages, workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import MessageContent from './MessageContent'
import MessageContentProvider from './MessageContentProvider'

export default function DirectMessage() {
  const { directId } = useAppParams()
  const directInfo = useDirect(directId)
  const dispatch = useDispatch()
  const isVisible = useDocumentVisibility()
  const emitSocket = useAppEmitSocket()

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))

      if (directInfo)
        emitSocket({
          key: 'makeReadMessage',
          messageId: message._id,
          targetId: directInfo.direct._id
        })
    }
  })

  useAppOnSocket({
    key: 'userReadedMessage',
    resFunc: data => {
      console.log('1111')
    }
  })

  const { data: directMessages } = useAppQuery({
    key: 'directMessages',
    url: {
      baseUrl: '/workspace/direct-messages/:directId/messages',
      urlParams: {
        directId: directInfo?.targetUser?._id || ''
      }
    },
    options: {
      queryKey: [directInfo?.targetUser?._id],
      enabled: !!directInfo?.targetUser?._id
    }
  })

  const { data: usersReadedMessage } = useAppQuery({
    key: 'usersReadedMessage',
    url: {
      baseUrl: '/workspace/usersReadedMessage/:targetId',
      urlParams: {
        targetId: directInfo?.direct?._id || ''
      }
    },
    options: {
      queryKey: [directInfo?.direct?._id],
      enabled: !!directInfo?.direct?._id
    }
  })

  console.log({ usersReadedMessage })

  useEffect(() => {
    if (directMessages)
      dispatch(
        workspaceActions.addMessages(
          directMessages?.messages.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as TMessages
          )
        )
      )
  }, [directMessages])

  return (
    <MessageContentProvider
      value={{
        title: directInfo?.targetUser?.userName || '',
        targetId: {
          directId: directInfo?.direct?._id
        },
        userTargetId: directInfo?.targetUser?._id
      }}
    >
      <MessageContent />
    </MessageContentProvider>
  )
}