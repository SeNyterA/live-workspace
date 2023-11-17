import { ActionIcon, Divider, Input, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'
import { TMessage } from '../../types/workspace.type'
import Message from './Message'
import { useMessageContent } from './MessageContentProvider'
import SendMessage from './SendMessage'

export default function MessageContent() {
  const { targetRef, scrollableRef, scrollIntoView } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({ duration: 300 })
  const refMessages = useRef<TMessage[]>([])
  const { messages, title } = useMessageContent()

  const scrollToBottom = () => {
    const scrollableDiv = scrollableRef.current
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight
    }
  }

  useEffect(() => {
    if (refMessages.current.length === 0) {
      scrollToBottom()
    }

    if (messages.length !== refMessages.current.length) {
      scrollToBottom()
    }

    // const timeoutId = setTimeout(() => {
    //   ;(targetRef as any).current = document.querySelector(
    //     `#id_${messages[messages.length - 1]._id}`
    //   )
    //   scrollIntoView()
    // }, 300)

    refMessages.current = messages

    // return () => clearTimeout(timeoutId)
  }, [messages, scrollIntoView])

  useEffect(() => {
    scrollToBottom()
  }, [])

  return (
    <>
      <div className='flex flex-1 flex-col'>
        <div className='flex h-12 items-center gap-3 px-4'>
          <p className='flex-1 text-lg'>{title}</p>
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
