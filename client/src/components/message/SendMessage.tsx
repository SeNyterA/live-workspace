import '@mantine/tiptap/styles.css'
import { useDispatch } from 'react-redux'
import useTyping from '../../hooks/useTyping'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import {
  ApiMutationType,
  useAppMutation
} from '../../services/apis/useAppMutation'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import Editor from '../new-message/Editor'
// import Editor from '../new-message/Editor'
import {
  TMessageContentValue,
  TTargetMessageId
} from './MessageContentProvider'
import Typing from './Typing'

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
    <div className='relative h-20'>
      <div className='absolute bottom-2 left-2 right-2 z-10 rounded-md border border-dashed border-gray-300 bg-white'>
        {/* <Divider variant='dashed' /> */}
        <Editor
          onChange={() => {
            messRefId && typing(messRefId)
          }}
          onSubmit={_createMessage}
        />
        <p className='flex justify-between pb-1 pl-4 pr-3 text-xs text-gray-500'>
          <Typing messRefId={messRefId} />

          <span>
            Press <kbd className='bg-gray-100'>⌘Enter</kbd> or{' '}
            <kbd className='bg-gray-100'>Alt Enter</kbd> to quickly send
          </span>
        </p>
      </div>
    </div>
  )
}
