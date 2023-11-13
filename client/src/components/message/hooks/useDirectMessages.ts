import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../../services/socket/useAppOnSocket'
import { TMessage } from '../../../types/workspace.type'

export default function useDirectMessages() {
  const { directId } = useAppParams()
  const dispatch = useDispatch()

  const { data: directMessages } = useAppQuery({
    key: 'directMessages',
    url: {
      baseUrl: '/workspace/direct-messages/:directId/messages',
      urlParams: {
        directId: directId!
      }
    },
    options: {
      queryKey: [directId],
      enabled: !!directId
    }
  })

  useEffect(() => {
    if (directMessages)
      dispatch(
        workspaceActions.addMessages(
          directMessages?.messages.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as { [directId: string]: TMessage }
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
        e => e.messageReferenceId === directId
      )
    ) || []

  return {
    messages
  }
}
