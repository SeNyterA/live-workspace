import { ActionIcon, Divider, Input, Loader, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import Message from './Message'
import { useMessageContent } from './MessageContentProvider'
import SendMessage from './SendMessage'

export default function MessageContent({
  loadMore,
  isLoading,
  queryCount
}: {
  loadMore?: (fromId?: string) => void
  isLoading?: boolean
  queryCount?: number
}) {
  const { targetRef, scrollableRef, scrollIntoView } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({ duration: 300 })

  const {
    ref: observerRef,
    inView,
    entry
  } = useInView({
    threshold: 0
  })

  const lastMessageIdRef = useRef<string>('')
  const { messages, title } = useMessageContent()

  const scrollToBottom = () => {
    const scrollableDiv = scrollableRef.current
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      if (messages[messages.length - 1]._id !== lastMessageIdRef.current)
        // scrollToBottom()

        lastMessageIdRef.current = messages[0]._id
    }
  }, [messages, scrollIntoView])

  useEffect(() => {}, [queryCount])

  useEffect(() => {
    if (inView && !isLoading && messages.length > 0) {
      const lastMessId = messages[0]._id
      loadMore && loadMore(lastMessId)
    }
  }, [inView])

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
            <div ref={observerRef} className='flex items-center justify-center'>
              {isLoading && <Loader size='xs' type='dots' />}
            </div>
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
