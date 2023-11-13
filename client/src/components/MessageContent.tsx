import { ActionIcon, Divider, Input, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../hooks/useAppParams'
import userMembers from '../hooks/userMembers'
import { workspaceActions } from '../redux/slices/workspace.slice'
import { useAppSelector } from '../redux/store'
import { useAppQuery } from '../services/apis/useAppQuery'
import { useAppOnSocket } from '../services/socket/useAppOnSocket'
import { TMessage } from '../types/workspace.type'
import Message from './message/Message'
import SendMessage from './message/SendMessage'

export default function MessageContent() {
  const { targetRef, scrollableRef, scrollIntoView } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >()
  const dispatch = useDispatch()

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))
    }
  })

  const { channelId } = useAppParams()
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

  userMembers({
    targetId: channelId
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollIntoView()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [channelMessages, scrollIntoView])

  return (
    <>
      <div className='flex flex-1 flex-col'>
        <div className='flex h-12 items-center gap-3 px-4'>
          <p className='flex-1 text-lg'>Channel name</p>
          <Input
            className=''
            size='sm'
            placeholder='Search'
            variant='unstyled'
            leftSection={<IconSearch className='h-4 w-4' />}
          />
          <ActionIcon variant='default'>
            <IconSearch className='h-4 w-4' />
          </ActionIcon>
          <ActionIcon variant='default'>
            <IconSearch className='h-4 w-4' />
          </ActionIcon>
          <ActionIcon variant='default'>
            <IconSearch className='h-4 w-4' />
          </ActionIcon>
        </div>

        <Divider variant='dashed' />

        <div className='relative flex-1'>
          <ScrollArea
            className='absolute inset-0 overflow-auto'
            viewportRef={scrollableRef}
            scrollbarSize={6}
            onScrollPositionChange={({ x, y }) => {
              console.log({ x, y })
            }}
          >
            {messages.map(message => (
              <Message message={message} key={message._id} />
            ))}
          </ScrollArea>
        </div>

        <Divider variant='dashed' />

        <SendMessage />
      </div>
    </>
  )
}
