import { Avatar, Divider, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import DOMPurify from 'dompurify'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../hooks/useAppParams'
import { workspaceActions } from '../redux/slices/workspace.slice'
import { useAppSelector } from '../redux/store'
import { useAppMutation } from '../services/apis/useAppMutation'
import { useAppQuery } from '../services/apis/useAppQuery'
import { useAppEmitSocket } from '../services/socket/useAppEmitSocket'
import { useAppOnSocket } from '../services/socket/useAppOnSocket'
import { EMessageType, TMessage } from '../types/workspace.type'
import Editor from './new-message/NewMessage'

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

  useAppOnSocket({
    key: 'startTyping',
    resFunc: ({ targetId, userId }) => {
      console.log({
        targetId,
        userId
      })
    }
  })
  const socketEmit = useAppEmitSocket()

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

  const { mutateAsync: createChannelMessage } = useAppMutation(
    'createChannelMessage'
  )

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
        <div className='h-12 bg-slate-500'></div>

        <div className='relative flex-1'>
          <ScrollArea
            className='absolute inset-0 overflow-auto'
            viewportRef={scrollableRef}
            scrollbarSize={6}
            onScrollPositionChange={({ x, y }) => {
              console.log({ x, y })
            }}
          >
            {messages.map((message, index) => (
              <div
                id={`id_${index}`}
                className='my-3 flex gap-2 pl-4'
                key={index}
                ref={targetRef}
              >
                <Avatar />
                <div className=''>
                  <p className='text-base font-medium'>
                    {message.messageType === EMessageType.System
                      ? message.messageType
                      : message.createdById}
                  </p>
                  <p className='text-xs leading-3 text-gray-500'>1 mins ago</p>
                  <div
                    className='mt-2 rounded bg-gray-50 p-1'
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(message.content)
                    }}
                  />
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <Divider variant='dashed' />
        <Editor
          onChange={() => {
            channelId &&
              socketEmit({
                key: 'startTyping',
                targetId: channelId
              })
          }}
          onSubmit={value => {
            if (channelId && value)
              createChannelMessage(
                {
                  url: {
                    baseUrl: '/workspace/channels/:channelId/messages',
                    urlParams: {
                      channelId: channelId
                    }
                  },
                  method: 'post',
                  payload: {
                    content: value
                  }
                },
                {
                  onSuccess(message) {
                    dispatch(
                      workspaceActions.addMessages({ [message._id]: message })
                    )

                    socketEmit({
                      key: 'stopTyping',
                      targetId: channelId
                    })
                  }
                }
              )
          }}
        />
      </div>
    </>
  )
}
