import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import useDirect from '../../hooks/useDirect'
import { TMessages, workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'

export default function DirectMessage() {
  const { directId } = useAppParams()

  const directInfo = useDirect(directId)
  const dispatch = useDispatch()
  const [formId, setFormId] = useState<string>()

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))
    }
  })
  const { data: targetUser } = useAppQuery({
    key: 'findUserByUserName',
    url: {
      baseUrl: '/user/by-username/:userName',
      urlParams: {
        userName: directId!
      }
    },
    options: {
      queryKey: [directId],
      enabled: !!directId
    }
  })

  useAppOnSocket({
    key: 'userReadedMessage',
    resFunc: data => {
      console.log(data)
    }
  })

  const { data: directMessages, isLoading } = useAppQuery({
    key: 'directMessages',
    url: {
      baseUrl: '/workspace/direct-messages/:targetId/messages',
      urlParams: {
        targetId: directInfo?.targetUser?._id || ''
      },
      queryParams: {
        pageSize: 100,
        formId
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

  return (
    <></>
    // <MessageContentProvider
    //   value={{
    //     title:
    //       directInfo?.direct.title ||
    //       directInfo?.targetUser?.userName ||
    //       targetUser?.user.userName ||
    //       '',
    //     targetId: {
    //       directId: directInfo?.direct?._id
    //     },
    //     userTargetId: directInfo?.targetUser?._id || targetUser?.user._id
    //   }}
    // >
    //   <MessageContent
    //     loadMore={setFormId}
    //     isLoading={isLoading}
    //     remainingCount={directMessages?.remainingCount}
    //   />
    // </MessageContentProvider>
  )
}
