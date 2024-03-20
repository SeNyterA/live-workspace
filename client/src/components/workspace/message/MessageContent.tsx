import { Loader, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { extractApi } from '../../../types'
import { useMessageContent } from './MessageContentProvider'
import MessageGroup from './MessageGroup'

export default function MessageContent() {
  const dispatch = useDispatch()
  const { messages, groupedMessages } = useMessageContent()
  const { channelId, directId, groupId } = useAppParams()
  const targetId = channelId || groupId || directId || ''
  const [fromId, setFormId] = useState<string | undefined>()

  const { scrollableRef } = useScrollIntoView<HTMLDivElement, HTMLDivElement>({
    duration: 300
  })
  const loadMoreRef = useRef<boolean>(false)
  const bottomRef = useRef<boolean>(false)
  const { ref: loadMoreObserverRef, inView: loadMoreInView } = useInView({
    threshold: 0,
    onChange: inView => {
      if (inView) {
        setFormId(messages[0]?.id)
        loadMoreRef.current = inView
      }
    }
  })
  const { ref: bottomObserverRef, inView: bottomInview } = useInView({
    threshold: 0,
    onChange: inView => {
      bottomRef.current = inView
    }
  })

  const { data, isPending } = useAppQuery({
    key: 'workpsaceMessages',
    url: {
      baseUrl: 'workspaces/:workspaceId/messages',
      urlParams: {
        workspaceId: targetId
      },
      queryParams: {
        size: 30,
        fromId
      }
    },
    options: {
      queryKey: [targetId],
      enabled: !!targetId
    },
    onSucess({ messages, remainingCount }) {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            messages
          })
        )
      )
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
          <div className='relative'>
            <div
              ref={loadMoreObserverRef}
              className='flex items-center justify-center bg-black'
            >
              {isPending && <Loader size='xs' type='dots' />}
            </div>
            <div
              ref={loadMoreObserverRef}
              className='absolute inset-0 bottom-[-100px] z-[-10] flex items-center justify-center bg-black'
            />
          </div>

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
              className='absolute inset-0 top-[-300px] z-[-10] flex items-center justify-center bg-black'
            />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
