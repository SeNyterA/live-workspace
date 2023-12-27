import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useTyping from '../../hooks/useTyping'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import '@mantine/tiptap/styles.css'
import {
  ApiMutationType,
  useAppMutation
} from '../../services/apis/useAppMutation'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import {
  ApiSocketType,
  useAppOnSocket
} from '../../services/socket/useAppOnSocket'
import Editor from '../new-message/Editor'
// import Editor from '../new-message/Editor'
import {
  TMessageContentValue,
  TTargetMessageId
} from './MessageContentProvider'

const getApiInfo = (
  targetId: TTargetMessageId
): {
  typeApi: 'channel' | 'direct' | 'group'
  keyApi: keyof Pick<
    ApiMutationType,
    'createChannelMessage' | 'createDirectMessage' | 'createGroupMessage'
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

  if (targetId.groupId) {
    return {
      keyApi: 'createGroupMessage',
      messRefId: targetId.groupId,
      typeApi: 'group'
    }
  }

  return {
    keyApi: 'createDirectMessage',
    messRefId: '',
    typeApi: 'direct'
  }
}

export default function SendMessage({
  targetId,
  userTargetId
}: Pick<TMessageContentValue, 'userTargetId' | 'targetId'>) {
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

  const { mutateAsync: createMessMutation } = useAppMutation(keyApi)

  const _createMessage = (value?: string) => {
    if (!value) return

    if (typeApi === 'channel' && messRefId)
      createMessMutation(
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
            dispatch(workspaceActions.addMessages({ [message._id]: message }))

            socketEmit({
              key: 'stopTyping',
              targetId: messRefId
            })
          }
        }
      )

    if (typeApi === 'group' && messRefId)
      createMessMutation(
        {
          url: {
            baseUrl: '/workspace/groups/:groupId/messages',
            urlParams: {
              groupId: messRefId
            }
          },
          method: 'post',
          payload: {
            content: value
          }
        },
        {
          onSuccess(message) {
            dispatch(workspaceActions.addMessages({ [message._id]: message }))

            socketEmit({
              key: 'stopTyping',
              targetId: messRefId
            })
          }
        }
      )

    if (typeApi === 'direct' && userTargetId)
      createMessMutation(
        {
          url: {
            baseUrl: '/workspace/direct-messages/:targetId/messages',
            urlParams: {
              targetId: userTargetId
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
  }

  return (
    <>
      <Editor
        onChange={() => {
          messRefId && typing(messRefId)
        }}
        onSubmit={_createMessage}
      />
      <p className='flex justify-between px-4 pb-1 text-xs text-gray-500'>
        <span>
          {
            userTypings?.find(e => e.targetId === messRefId && e.type === 1)
              ?.userId
          }
        </span>

        <span>
          Press <kbd>⌘Enter</kbd> or <kbd>Alt Enter</kbd> to quickly send
        </span>
      </p>
    </>
  )
}
