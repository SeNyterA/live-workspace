import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useTyping from '../../hooks/useTyping'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import {
  ApiMutationType,
  useAppMutation
} from '../../services/apis/useAppMutation'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import {
  ApiSocketType,
  useAppOnSocket
} from '../../services/socket/useAppOnSocket'
import Editor from '../new-message/NewMessage'
import { TTargetMessageId, useMessageContent } from './MessageContentProvider'

const getApiInfo = (
  targetId: TTargetMessageId
): {
  typeApi: 'channel' | 'direct' | 'group'
  keyApi: keyof Pick<
    ApiMutationType,
    'createChannelMessage' | 'createDirectMessage'
  >
  messRefId?: string
} => {
  if (targetId.channelId) {
    return {
      keyApi: 'createChannelMessage',
      messRefId: targetId.channelId,
      typeApi: 'channel'
    }
  }
  if (targetId.directId) {
    return {
      keyApi: 'createDirectMessage',
      messRefId: targetId.directId,
      typeApi: 'direct'
    }
  }

  return {
    keyApi: 'createDirectMessage',
    messRefId: '',
    typeApi: 'direct'
  }
}

export default function SendMessage() {
  const { targetId, userTargetId } = useMessageContent()
  const dispatch = useDispatch()
  const { keyApi, messRefId, typeApi } = getApiInfo(targetId)
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

  const { mutateAsync: createMess } = useAppMutation(keyApi)

  return (
    <>
      {userTypings?.find(e => e.targetId === messRefId && e.type === 1)?.userId}
      <Editor
        onChange={() => {
          messRefId && typing(messRefId)
        }}
        onSubmit={value => {
          if (messRefId && value) {
            if (typeApi === 'channel')
              createMess(
                {
                  url: {
                    baseUrl: '/workspace/channels/:channelId/messages',
                    urlParams: {
                      channelId: messRefId
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
                      targetId: messRefId
                    })
                  }
                }
              )

            if (typeApi === 'direct' && userTargetId)
              Array(1000)
                .fill(1)
                .map((e, index) =>
                  createMess(
                    {
                      url: {
                        baseUrl:
                          '/workspace/direct-messages/:targetId/messages',
                        urlParams: {
                          targetId: userTargetId
                        }
                      },
                      method: 'post',
                      payload: {
                        content: value + index + '_______' + Date.now()
                      }
                    },
                    {
                      onSuccess(message) {
                        dispatch(
                          workspaceActions.addMessages({
                            [message._id]: message
                          })
                        )

                        socketEmit({
                          key: 'stopTyping',
                          targetId: userTargetId
                        })
                      }
                    }
                  )
                )
          }
        }}
      />
    </>
  )
}
