import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconChevronRight, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { useAppEmitSocket } from '../../../services/socket/useAppEmitSocket'
import SendMessage from './create-message/SendMessage'
import Info from './info/Info'
import MessageContent from './MessageContent'
import MessageContentProvider from './MessageContentProvider'
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

  const workspace = useAppSelector(state =>
    Object.values(state.workspace.workspaces).find(e => e.id === channelId)
  )

  return (
    <MessageContentProvider>
      <div className='flex flex-1'>
        <div className='flex flex-1 flex-col'>
          <div className='flex h-12 items-center gap-2 px-4'>
            <p className='flex-1 text-lg'>{workspace?.title}</p>
            <Input
              size='sm'
              placeholder='Search on'
              leftSection={<IconSearch size={14} />}
              className='flex h-[30px] max-w-[230px] flex-1 items-center rounded'
              classNames={{
                input: 'min-h-[20px] h-[20px]'
              }}
            />

            <ActionIcon size={30} onClick={() => setOpenInfo(e => !e)}>
              <IconChevronRight
                className={`h-4 w-4 transition-transform ${
                  openInfo || 'rotate-180'
                }`}
              />
            </ActionIcon>
          </div>
          <Divider variant='dashed' className='mx-4 border-gray-200/20' />

          <MessageContent key={workspaceId} />

          <SendMessage
            classNames={{
              rootWrapper: 'mx-2'
            }}
            targetId={channelId || groupId || directId || ''}
            createMessage={({ files, value }) => {
              sendWorkspaceMessage(
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
                      attachments: files.map(file => ({
                        fileId: file.id
                      }))
                    } as any
                  }
                },
                {
                  onSuccess(message) {
                    dispatch(
                      workspaceActions.updateWorkspaceStore({
                        messages: { [message.id]: message }
                      })
                    )
                    socketEmit({
                      key: 'stopTyping',
                      targetId: workspaceId
                    })
                  }
                }
              )
            }}
          />
        </div>

        <Thread
          createMessage={({ files, value, thread }) => {
            sendWorkspaceMessage(
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
                    attachments: files.map(file => ({
                      fileId: file.id
                    })),
                    threadToId: thread.threadId,
                    replyToId: thread.replyId
                  } as any
                }
              },
              {
                onSuccess(message) {
                  dispatch(
                    workspaceActions.updateWorkspaceStore({
                      messages: { [message.id]: message }
                    })
                  )
                  socketEmit({
                    key: 'stopTyping',
                    targetId: workspaceId
                  })
                }
              }
            )
          }}
        />

        {openInfo && (
          <>
            <Divider
              orientation='vertical'
              variant='dashed'
              className='border-gray-200/20'
            />
            <Info />
          </>
        )}
      </div>
    </MessageContentProvider>
  )
}
