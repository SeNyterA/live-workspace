import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconChevronRight, IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { TMessages, workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import Info from './info/Info'
import InfoProvier from './info/InfoProvier'
import MessageContent from './MessageContent'
import MessageContentProvider from './MessageContentProvider'
import SendMessage from './SendMessage'
import Thread from './thread/Thread'

export default function ChannelMessage() {
  const [openInfo, setOpenInfo] = useState(false)
  const dispatch = useDispatch()
  const { channelId } = useAppParams()
  const socketEmit = useAppEmitSocket()
  const { mutateAsync: createChannelMessage } = useAppMutation(
    'createChannelMessage',
    {
      mutationOptions: {
        onError(error, variables, context) {
          console.log('onError', {
            error,
            variables,
            context
          })
        },
        onMutate(variables) {
          console.log('onMutate', {
            variables
          })
        },
        onSettled(data, error, variables, context) {
          console.log('onSettled', {
            data,
            error,
            variables,
            context
          })
        },
        onSuccess(data, variables, context) {
          console.log('onSuccess', {
            data,
            variables,
            context
          })
        }
      }
    }
  )

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))
    }
  })

  const channel = useAppSelector(state =>
    Object.values(state.workspace.channels).find(e => e._id === channelId)
  )
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

  useEffect(() => {
    if (channelMessages)
      dispatch(
        workspaceActions.addMessages(
          channelMessages?.messages.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as TMessages
          )
        )
      )
  }, [channelMessages])

  return (
    <div className='flex flex-1'>
      <div className='flex flex-1 flex-col'>
        <div className='flex h-12 items-center gap-3 px-4'>
          <p className='flex-1 text-lg'>{channel?.title}</p>
          <Input
            size='sm'
            placeholder='Search on channel'
            leftSection={<IconSearch size={14} />}
            className='flex h-[30px] max-w-[270px] flex-1 items-center rounded bg-gray-100'
            classNames={{
              input: 'bg-transparent border-none min-h-[20px] h-[20px]'
            }}
          />

          <ActionIcon
            variant='light'
            className='h-[30px] w-[30px] bg-gray-100'
            onClick={() => setOpenInfo(e => !e)}
          >
            <IconChevronRight
              className={`h-4 w-4 transition-transform ${
                openInfo || 'rotate-180'
              }`}
            />
          </ActionIcon>
        </div>
        <Divider variant='dashed' />
        <MessageContentProvider
          value={{
            title: channel?.title || '',
            targetId: {
              channelId
            }
          }}
        >
          <MessageContent
            key={JSON.stringify({
              targetId: {
                channelId
              }
            })}
          />
        </MessageContentProvider>
        <SendMessage
          targetId={channelId || ''}
          createMessage={async ({ files, value }) => {
            if (!channelId) return
            await createChannelMessage(
              {
                url: {
                  baseUrl: '/workspace/channels/:channelId/messages',
                  urlParams: { channelId }
                },
                method: 'post',
                payload: {
                  attachments: files,
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
      </div>

      <Thread
        createMessage={async ({ files, value, thread }) => {
          if (!channelId) return
          await createChannelMessage(
            {
              url: {
                baseUrl: '/workspace/channels/:channelId/messages',
                urlParams: { channelId }
              },
              method: 'post',
              payload: {
                attachments: files,
                content: value,
                replyRootId: thread.threadId,
                replyToMessageId: thread.replyId
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

      {openInfo && (
        <>
          <Divider orientation='vertical' variant='dashed' />
          <InfoProvier
            value={{
              title: channel?.title || '',
              targetId: { channelId },
              type: 'channel'
            }}
          >
            <Info />
          </InfoProvier>
        </>
      )}
    </div>
  )
}
