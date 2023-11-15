import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useDirect from '../../../hooks/useDirect'
import {
  TMessages,
  workspaceActions
} from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'

export default function useDirectMessages() {
  const dispatch = useDispatch()
  const directInfo = useDirect()

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

  const messages =
    useAppSelector(state =>
      Object.values(state.workspace.messages).filter(
        e => directInfo?.direct._id === e.messageReferenceId
      )
    ) || []

  return {
    messages
  }
}
