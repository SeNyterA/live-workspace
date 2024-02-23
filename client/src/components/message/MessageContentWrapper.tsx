import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconChevronRight, IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { TMessages, workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import Info from './info/Info'
import InfoProvier from './info/InfoProvier'
import MessageContent from './MessageContent'
import MessageContentProvider from './MessageContentProvider'
import SendMessage from './SendMessage'
import Thread from './thread/Thread'

export default function MessageContentWrapper() {
  const { channelId, groupId, directId } = useAppParams()
  const workspaceId = channelId || groupId || directId || ''

  const [openInfo, setOpenInfo] = useState(false)
  const dispatch = useDispatch()

  const socketEmit = useAppEmitSocket()
  const { mutateAsync: sendWorkspaceMessage } = useAppMutation(
    'sendWorkspaceMessage'
  )

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(
        workspaceActions.updateData({ messages: { [message._id]: message } })
      )
    }
  })

  const workspace = useAppSelector(state =>
    Object.values(state.workspace.workspaces).find(e => e._id === channelId)
  )
  const { data: workpsaceMessages, refetch } = useAppQuery({
    key: 'workpsaceMessages',
    url: {
      baseUrl: 'workspaces/:workspaceId/messages',
      urlParams: {
        workspaceId: workspaceId
      }
    },
    options: {
      queryKey: [workspaceId],
      enabled: !!workspaceId
    }
  })

  useEffect(() => {
    if (workpsaceMessages)
      dispatch(
        workspaceActions.updateData({
          messages: workpsaceMessages?.messages.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as TMessages
          )
        })
      )
  }, [workpsaceMessages])

  return (
    <div className='flex flex-1'>
      <div className='flex flex-1 flex-col'>
        <div className='flex h-12 items-center gap-3 px-4'>
          <p className='flex-1 text-lg'>{workspace?.title}</p>
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
            title: workspace?.title || '',
            targetId: workspaceId
          }}
        >
          <MessageContent
            key={workspaceId}
            loadMore={loadFromId => {
              console.log('loadmore', loadFromId)
            }}
            remainingCount={workpsaceMessages?.remainingCount}
          />
        </MessageContentProvider>

        <SendMessage
          targetId={channelId || ''}
          createMessage={async ({ files, value }) => {
            Array(100)
              .fill(0)
              .map(async () => {
                await sendWorkspaceMessage(
                  {
                    url: {
                      baseUrl: '/workspaces/:workspaceId/messages',
                      urlParams: {
                        workspaceId: workspaceId
                      }
                    },
                    method: 'post',
                    payload: {
                      message: {
                        content: value,
                        isPinned: Math.random() > 0.2
                      } as any
                    }
                  },
                  {
                    onSuccess(message) {
                      dispatch(
                        workspaceActions.updateData({
                          messages: { [message._id]: message }
                        })
                      )
                      socketEmit({
                        key: 'stopTyping',
                        targetId: workspaceId
                      })
                    }
                  }
                )
              })
          }}
        />
      </div>

      <Thread
        createMessage={async ({ files, value, thread }) => {
          await sendWorkspaceMessage(
            {
              url: {
                baseUrl: '/workspaces/:workspaceId/messages',
                urlParams: {
                  workspaceId: workspaceId
                }
              },
              method: 'post',
              payload: {
                message: {
                  content: value
                } as any,
                threadId: thread.threadId,
                replyToId: thread.replyId
              }
            },
            {
              onSuccess(message) {
                dispatch(
                  workspaceActions.updateData({
                    messages: { [message._id]: message }
                  })
                )
                socketEmit({
                  key: 'stopTyping',
                  targetId: workspaceId || ''
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
              title: workspace?.title || '',
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
