import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconChevronRight, IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { TMessages, workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import { EMessageFor } from '../../types/workspace.type'
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
          targetType={EMessageFor.Channel}
        />
      </div>

      <Thread />

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
