import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import useDirect from '../../hooks/useDirect'
import { TMessages, workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppQuery } from '../../services/apis/useAppQuery'
import MessageContent from './MessageContent'
import MessageContentProvider from './MessageContentProvider'

export default function DirectMessage() {
  const { directId } = useAppParams()
  const directInfo = useDirect(directId)
  const dispatch = useDispatch()

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

  const s = directInfo?.targetUser?._id

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
