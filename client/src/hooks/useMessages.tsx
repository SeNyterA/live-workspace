import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../redux/slices/workspace.slice'
import { useAppSelector } from '../redux/store'
import { useAppQuery } from '../services/apis/useAppQuery'
import { useAppOnSocket } from '../services/socket/useAppOnSocket'
import { TMessage } from '../types/workspace.type'
import useAppParams from './useAppParams'

export default function useMessages() {
  const { channelId } = useAppParams()
  const dispatch = useDispatch()
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

  const messages =
    useAppSelector(state =>
      Object.values(state.workspace.messages).filter(
        e => e.messageReferenceId === channelId
      )
    ) || []

  useEffect(() => {
    if (channelMessages)
      dispatch(
        workspaceActions.addMessages(
          channelMessages?.messages.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as { [channelId: string]: TMessage }
          )
        )
      )
  }, [channelMessages])

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))
    }
  })

  return {
    messages
  }
}
