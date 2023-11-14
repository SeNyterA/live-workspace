import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useDirectId from '../../../hooks/useDiectId'
import {
  TMessages,
  workspaceActions
} from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../../services/socket/useAppOnSocket'

export default function useDirectMessages() {
  const dispatch = useDispatch()
  const directInfo = useDirectId()

  const { data: directMessages } = useAppQuery({
    key: 'directMessages',
    url: {
      baseUrl: '/workspace/direct-messages/:directId/messages',
      urlParams: {
        directId: directInfo?.direct._id!
      }
    },
    options: {
      queryKey: [directInfo?.direct._id],
      enabled: !!directInfo?.direct._id
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

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))
    }
  })

  const messages =
    useAppSelector(state =>
      Object.values(state.workspace.messages).filter(
        e => directInfo?.direct._id === e.messageReferenceId
      )
    ) || []

  console.log({ messages, directInfo })
  return {
    messages
  }
}
