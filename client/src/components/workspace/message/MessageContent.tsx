import { Loader, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { appGetFn, useAppQuery } from '../../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../../services/socket/useAppOnSocket'
import { extractApi } from '../../../types'
import { useMessageContent } from './MessageContentProvider'
import MessageGroup from './MessageGroup'

export default function MessageContent() {
  const dispatch = useDispatch()
  const { messages, groupedMessages } = useMessageContent()
  const { channelId, directId, groupId } = useAppParams()
  const targetId = channelId || groupId || directId || ''

  const { scrollableRef, targetRef, scrollIntoView } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >({
    duration: 300
  })

  const loadMoreMessageIdRef = useRef<string>()

  const bottomRef = useRef<boolean>(false)
  const { ref: loadMoreObserverRef, inView: loadMoreInView } = useInView({
    threshold: 0,
    onChange: inView => {
      if (inView && !!loadMoreMessageIdRef.current) {
        loadMoreMessageIdRef.current = messages[0].id

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
          onSucess({ messages }) {
            dispatch(
              workspaceActions.updateWorkspaceStore(
                extractApi({
                  messages: messages
                })
              )
            )

            setTimeout(() => {
              targetRef.current = document.getElementById(
                loadMoreMessageIdRef.current!
              ) as any

              scrollIntoView()
            }, 0)
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

      setTimeout(() => {
        if (true) {
          targetRef.current = document.getElementById(message.id) as any
          scrollIntoView()
        }
      }, 200)
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
      if (!loadMoreMessageIdRef.current) {
        setTimeout(() => {
          scrollToBottom()
        }, 0)

        setTimeout(() => {
          loadMoreMessageIdRef.current = messages[messages.length - 1].id
        }, 1000)
      }
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
              className='flex items-center justify-center'
            >
              {isPending && <Loader size='xs' type='dots' />}
            </div>
            <div
              ref={loadMoreObserverRef}
              className='absolute inset-0 bottom-[-400px] z-[-10] flex items-center justify-center'
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
              className='absolute inset-0 top-[-300px] z-[-10] flex items-center justify-center'
            />
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
