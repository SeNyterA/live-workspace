import { ActionIcon, Divider, Input, Loader, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { IconChevronRight, IconSearch } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import Message from './Message'
import { useMessageContent } from './MessageContentProvider'
import SendMessage from './SendMessage'

export default function MessageContent({
  loadMore,
  isLoading,
  remainingCount
}: {
  loadMore?: (fromId?: string) => void
  isLoading?: boolean
  remainingCount?: number
}) {
  const [openInfo, setOpenInfo] = useState(false)
  const { messages, title } = useMessageContent()
  const lastMessageIdRef = useRef<string>()
  const loadMoreMessageIdRef = useRef<string>()
  const { scrollableRef } = useScrollIntoView<HTMLDivElement, HTMLDivElement>({
    duration: 300
  })
  const loadMoreRef = useRef<boolean>(false)
  const bottomRef = useRef<boolean>(false)
  const { ref: loadMoreObserverRef, inView: loadMoreInView } = useInView({
    threshold: 0,
    onChange: inView => {
      loadMoreRef.current = inView
    }
  })
  const { ref: bottomObserverRef } = useInView({
    threshold: 0,
    onChange: inView => {
      bottomRef.current = inView
    }
  })

  const scrollToBottom = () => {
    const scrollableDiv = scrollableRef.current
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight
    }
  }

  const scrollTo = (to: number) => {
    const scrollableDiv = scrollableRef.current
    if (scrollableDiv) {
      scrollableDiv.scrollTop = to
    }
  }

  useEffect(() => {
    if (!lastMessageIdRef.current) {
      scrollToBottom()
    }

    if (bottomRef.current) {
      scrollToBottom()
    }

    if (messages.length > 0) {
      lastMessageIdRef.current = messages[0]._id
    }

    if (
      lastMessageIdRef.current &&
      loadMoreMessageIdRef.current &&
      lastMessageIdRef.current !== loadMoreMessageIdRef.current
    ) {
      const messContent = document.querySelector(
        `#id_${loadMoreMessageIdRef.current}`
      )

      if (messContent) {
        const { top } = messContent.getBoundingClientRect()
        scrollTo(top)
        loadMoreMessageIdRef.current = undefined
      }
    }
  }, [messages])

  useEffect(() => {
    if (
      loadMoreInView &&
      lastMessageIdRef.current &&
      !isLoading &&
      loadMore &&
      remainingCount
    ) {
      loadMoreMessageIdRef.current = lastMessageIdRef.current
      loadMore(lastMessageIdRef.current)
    }
  }, [loadMoreInView])

  return (
    <>
      <div className='flex flex-1'>
        <div className='flex flex-1 flex-col'>
          <div className='flex h-12 items-center gap-3 px-4'>
            <p className='flex-1 text-lg'>{title}</p>
            <Input
              className=''
              variant='unstyled'
              size='sm'
              placeholder='Search on channel'
              leftSection={<IconSearch size={14} />}
              classNames={{
                wrapper: 'flex h-[30px] w-64 items-center bg-gray-100 rounded border-none',
                input: 'h-fit border-none'
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

          <div className='relative flex-1'>
            {messages.length > 0 && (
              <ScrollArea
                className='absolute inset-0 overflow-auto'
                viewportRef={scrollableRef}
                scrollbarSize={6}
              >
                {remainingCount ? (
                  <div className='relative'>
                    <div
                      ref={loadMoreObserverRef}
                      className='flex items-center justify-center'
                    >
                      {isLoading && <Loader size='xs' type='dots' />}
                    </div>
                    <div
                      ref={loadMoreObserverRef}
                      className='absolute inset-0 bottom-[-100px] z-[-10] flex items-center justify-center'
                    />
                  </div>
                ) : (
                  <></>
                )}

                {messages.map(message => (
                  <Message message={message} key={message._id} />
                ))}

                <div className='relative'>
                  <div
                    ref={bottomObserverRef}
                    className='absolute inset-0 top-[-300px] z-[-10] flex items-center justify-center'
                  />
                </div>
              </ScrollArea>
            )}
          </div>

          <Divider variant='dashed' />

          <SendMessage />
        </div>
        {openInfo && (
          <>
            <Divider orientation='vertical' variant='dashed' />
            <div className='w-72'></div>
          </>
        )}
      </div>
    </>
  )
}
