import { Loader, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { useAppEmitSocket } from '../../../services/socket/useAppEmitSocket'
import { useAppOnSocket } from '../../../services/socket/useAppOnSocket'
import { extractApi } from '../../../types'
import { useMessageContent } from './MessageContentProvider'
import MessageGroup from './MessageGroup'

export default function MessageContent() {
  const dispatch = useDispatch()
  const { messages, groupedMessages } = useMessageContent()
  const { channelId, directId, groupId } = useAppParams()
  const targetId = channelId || groupId || directId || ''
  const emitSocket = useAppEmitSocket()

  const { scrollableRef, targetRef, scrollIntoView } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({
    duration: 300
  })

  const bottomRef = useRef<boolean>(false)
  const isCompleteRef = useRef<boolean>(false)
  const loadMoreLoadingRef = useRef<boolean>(false)
  const [loadBeforeId, setLoadBeforeId] = useState<string>()
  const messageLastId = useRef<string>()

  const { ref: loadMoreObserverRef } = useInView({
    threshold: 0,
    onChange: inView => {
      if (inView && !isCompleteRef.current && !loadMoreLoadingRef.current) {
        setLoadBeforeId(messages[0].id)
        // appGetFn({
        //   key: 'workpsaceMessages',
        //   url: {
        //     baseUrl: 'workspaces/:workspaceId/messages',
        //     urlParams: {
        //       workspaceId: targetId
        //     },
        //     queryParams: {
        //       size: 50,
        //       fromId: messages[0].id
        //     }
        //   },
        //   onSuccess({ messages, isCompleted }) {
        //     if (isCompleted) {
        //       isCompleteRef.current = true
        //     }
        //     dispatch(
        //       workspaceActions.updateWorkspaceStore(
        //         extractApi({
        //           messages: messages
        //         })
        //       )
        //     )
        //   }
        // }).finally(() => {})
      }
    }
  })

  const { ref: bottomObserverRef, inView: bottomInview } = useInView({
    threshold: 0,
    onChange: inView => {
      bottomRef.current = inView
    }
  })

  useAppOnSocket({
    key: 'reaction',
    resFunc({ reaction }) {
      console.log({ reaction })
      dispatch(
        workspaceActions.updateWorkspaceStore({
          reactions: { [`${reaction.messageId}_${reaction.userId}`]: reaction }
        })
      )
    }
  })

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({ messages: [message] })
        )
      )

      if (bottomRef.current) {
        scrollToBottom()
      }
    }
  })

  const { isPending } = useAppQuery({
    key: 'workpsaceMessages',
    url: {
      baseUrl: 'workspaces/:workspaceId/messages',
      urlParams: {
        workspaceId: targetId
      },
      queryParams: {
        size: 100,
        fromId: loadBeforeId
      }
    },
    options: {
      queryKey: [targetId],
      enabled: !!targetId,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    },
    onSuccess({ messages, isCompleted }) {
      isCompleteRef.current = isCompleted
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            messages
          })
        )
      )
    }
  })
  useEffect(() => {
    loadMoreLoadingRef.current = isPending
  }, [isPending])

  const scrollToTop = () => {
    const scrollableDiv = scrollableRef.current
    if (scrollableDiv) {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight
    }
  }
  const scrollToBottom = () => {
    const scrollableDiv = scrollableRef.current
    if (scrollableDiv) {
      scrollableDiv.scrollTop = 0
    }
  }

  useEffect(() => {
    if (
      !!messages.length &&
      messageLastId.current !== messages[messages.length - 1].id
    ) {
      messageLastId.current = messages[messages.length - 1].id
      emitSocket({
        key: 'readedMessage',
        messageId: messages[messages.length - 1].id,
        workspaceId: targetId
      })
    }
  }, [messages])

  return (
    <div className='relative flex-1'>
      {messages.length > 0 && (
        <ScrollArea
          className='absolute inset-0 overflow-hidden'
          viewportRef={scrollableRef}
          scrollbarSize={0}
          onCompositionStart={e => console.log(e)}
          onCompositionEnd={e => console.log(e)}
          classNames={{ viewport: 'scale-y-[-1]' }}
        >
          <div className='relative scale-y-[-1]'>
            <div
              ref={bottomObserverRef}
              className='absolute inset-0 top-[-300px] z-[-10] flex items-center justify-center'
            />
          </div>

          <div className='z-10 scale-y-[-1]'>
            {groupedMessages.map(groupMessage => (
              <MessageGroup
                key={groupMessage.messages[0].id}
                messageGroup={groupMessage}
                scrollableRef={scrollableRef}
              />
            ))}
          </div>

          <div className='relative flex w-full scale-y-[-1] items-center justify-center'>
            {isPending && !messages.length && (
              <Loader size='xs' type='dots' className='my-2' />
            )}
            <div
              ref={loadMoreObserverRef}
              className='invisible absolute inset-0 bottom-[-800px] -z-10 flex justify-center bg-black'
            />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
