import { Loader, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import useRenderCount from '../../../hooks/useRenderCount'
import { useMessageContent } from './MessageContentProvider'
import MessageGroup from './MessageGroup'

export default function MessageContent({
  loadMore,
  isLoading,
  remainingCount
}: {
  loadMore?: (fromId?: string) => void
  isLoading?: boolean
  remainingCount?: number
}) {
  useRenderCount('MessageContent')
  const { messages, groupedMessages } = useMessageContent()
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

  useLayoutEffect(() => {
    if (!lastMessageIdRef.current && messages) {
      scrollToBottom()
    }
  }, [messages])

  useEffect(() => {
    if (!lastMessageIdRef.current && messages) {
      scrollToBottom()
    }

    if (bottomRef.current) {
      scrollToBottom()
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

    const timeOut = setTimeout(() => {
      if (messages.length > 0) lastMessageIdRef.current = messages[0].id
    }, 0)
    return () => {
      clearTimeout(timeOut)
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
    <div className='relative flex-1'>
      {messages.length > 0 && (
        <ScrollArea
          className='absolute inset-0 overflow-hidden'
          viewportRef={scrollableRef}
          scrollbarSize={6}
          onCompositionStart={e => console.log(e)}
          onCompositionEnd={e => console.log(e)}
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
                className='absolute inset-0 bottom-[-100px] z-[-10] flex items-center justify-center bg-black'
              />
            </div>
          ) : (
            <></>
          )}

          {groupedMessages.map(groupMessage => (
            <MessageGroup
              key={groupMessage.messages[0].id}
              messageGroup={groupMessage}
              scrollableRef={scrollableRef}
            />
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
  )
}
