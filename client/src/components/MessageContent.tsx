import { ActionIcon, Divider, Input, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../redux/slices/workspace.slice'
import { useAppOnSocket } from '../services/socket/useAppOnSocket'
import useMessages from './message/hooks/useMessages'
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

  const { messages } = useMessages()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollIntoView()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [messages, scrollIntoView])

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
