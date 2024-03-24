import { Loader, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { appGetFn, useAppQuery } from '../../../services/apis/useAppQuery'
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
  const emitScoket = useAppEmitSocket()

  const { scrollableRef, targetRef, scrollIntoView } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({
    duration: 300
  })

  const bottomRef = useRef<boolean>(false)
  const isCompleteRef = useRef<boolean>(false)

  const { ref: loadMoreObserverRef, inView: loardMoreInview } = useInView({
    threshold: 0,
    onChange: inView => {
      if (inView && !isCompleteRef.current && messages.length > 0) {
        appGetFn({
          key: 'workpsaceMessages',
          url: {
            baseUrl: 'workspaces/:workspaceId/messages',
            urlParams: {
              workspaceId: targetId
            },
            queryParams: {
              size: 50,
              fromId: messages[0].id
            }
          },
          onSucess({ messages, isCompleted }) {
            // if (isCompleted) {
            //   isCompleteRef.current = true
            // }
            dispatch(
              workspaceActions.updateWorkspaceStore(
                extractApi({
                  messages: messages
                })
              )
            )
          }
        })
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

      // if (message.workspaceId === targetId) {
      //   emitScoket({
      //     key: 'readedMessage',
      //     messageId: message.id,
      //     workspaceId: targetId
      //   })
      // }
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
        size: 50
      }
    },
    options: {
      queryKey: [targetId],
      enabled: !!targetId,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    },
    onSucess({ messages }) {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            messages
          })
        )
      )
    }
  })

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

  return (
    <div className='relative flex-1'>
      {messages.length > 0 && (
        <ScrollArea
          className='absolute inset-0 overflow-hidden'
          viewportRef={scrollableRef}
          scrollbarSize={6}
          onCompositionStart={e => console.log(e)}
          onCompositionEnd={e => console.log(e)}
          classNames={{ viewport: 'scale-y-[-1]' }}
        >
          <div className='relative'>
            <div
              ref={bottomObserverRef}
              className='absolute inset-0 top-[-300px] z-[-10] flex items-center justify-center bg-black'
            />
          </div>
          <div className='scale-y-[-1]'>
            {groupedMessages.map(groupMessage => (
              <MessageGroup
                key={groupMessage.messages[0].id}
                messageGroup={groupMessage}
                scrollableRef={scrollableRef}
              />
            ))}
          </div>

          <div className='relative'>
            <div
              ref={loadMoreObserverRef}
              className='flex items-center justify-center'
            >
              {isPending && <Loader size='xs' type='dots' />}
            </div>
            <div
              ref={loadMoreObserverRef}
              className='absolute inset-0 bottom-[-400px] z-[-10] flex items-center justify-center bg-black'
            />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
