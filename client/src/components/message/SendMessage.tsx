import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import useTyping from '../../hooks/useTyping'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import {
  ApiSocketType,
  useAppOnSocket
} from '../../services/socket/useAppOnSocket'
import Editor from '../new-message/NewMessage'

export default function SendMessage() {
  const { channelId, directId } = useAppParams()

  const dispatch = useDispatch()
  const [userTypings, setUserTypings] =
    useState<ApiSocketType['typing']['response'][]>()
  useAppOnSocket({
    key: 'typing',
    resFunc: ({ targetId, userId, type }) => {
      setUserTypings([...(userTypings || []), { targetId, userId, type }])
    }
  })
  const socketEmit = useAppEmitSocket()
  const typing = useTyping()

  const { mutateAsync: createChannelMessage } = useAppMutation(
    'createChannelMessage'
  )
  const { mutateAsync: createDirectMessage } = useAppMutation(
    'createDirectMessage'
  )

  return (
    <>
      {userTypings?.find(e => e.targetId === channelId && e.type === 1)?.userId}
      <Editor
        onChange={() => {
          channelId && typing(channelId)
        }}
        onSubmit={value => {
          if (channelId && value)
            createChannelMessage(
              {
                url: {
                  baseUrl: '/workspace/channels/:channelId/messages',
                  urlParams: {
                    channelId: channelId
                  }
                },
                method: 'post',
                payload: {
                  content: value
                }
              },
              {
                onSuccess(message) {
                  dispatch(
                    workspaceActions.addMessages({ [message._id]: message })
                  )

                  socketEmit({
                    key: 'stopTyping',
                    targetId: channelId
                  })
                }
              }
            )
        }}
      />
    </>
  )
}
