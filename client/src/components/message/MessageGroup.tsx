import { ActionIcon, Avatar, HoverCard, Image } from '@mantine/core'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useLayout } from '../../Layout'
import { useAppSelector } from '../../redux/store'
import Watching from '../../redux/Watching'
import { EMessageType } from '../../types/workspace.type'
import { groupByFileType } from '../new-message/helper'
import { MessageStyle } from '../new-message/style'
import UserDetailProvider from '../user/UserDetailProvider'
import { TGroupedMessage } from './MessageContentProvider'

export default function MessageGroup({
  messageGroup
}: {
  messageGroup: TGroupedMessage
}) {
  const { updateThread } = useLayout()
  const createdByUser = useAppSelector(state =>
    Object.values(state.workspace.users).find(
      e => e._id === messageGroup.userId
    )
  )

  const isOwner = useAppSelector(
    state =>
      state.auth.userInfo?._id === messageGroup.userId &&
      messageGroup.type === EMessageType.Normal
  )

  return (
    <div
      className={`my-3 flex gap-2 px-4 ${
        isOwner ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isOwner && (
        <UserDetailProvider user={createdByUser}>
          <Avatar />
        </UserDetailProvider>
      )}

      <MessageStyle
        className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
      >
        {!isOwner && (
          <p className='font-medium'>
            {messageGroup.type === EMessageType.System
              ? EMessageType.System
              : createdByUser?.userName}
          </p>
        )}

        <p className='text-xs leading-3 text-gray-500'>
          {dayjs(messageGroup.messages[0].createdAt).format(
            'YYYY-MM-DD HH:mm:ss'
          )}
        </p>
        {messageGroup.messages.map(message => {
          const { images } = groupByFileType(message.attachments || [])
          return (
            <HoverCard
              width={280}
              shadow='md'
              position={isOwner ? 'bottom-end' : 'bottom-start'}
              // withArrow
              offset={4}
            >
              <HoverCard.Target>
                <div
                  className={`mt-1 flex max-w-2xl flex-col first:mt-0 ${
                    isOwner && 'items-end'
                  }`}
                >
                  {!!message.replyToMessageId && (
                    <Watching
                      watchingFn={state => ({
                        replyMessage:
                          state.workspace.messages[message.replyToMessageId!],
                        user: state.workspace.users[message.createdById!]
                      })}
                    >
                      {data => (
                        <div
                          className='line-clamp-1 h-4 max-w-96 cursor-pointer overflow-hidden truncate text-xs !text-blue-400 !bg-transparent hover:underline'
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              data?.replyMessage?.content || ''
                            )
                          }}
                        />
                      )}
                    </Watching>
                  )}

                  <div
                    className='w-fit rounded bg-gray-100 p-1'
                    key={message._id}
                    onClick={() => {
                      updateThread({
                        targetId: message.messageReferenceId,
                        targetType: message.messageFor,
                        threadId: message.replyRootId || message._id
                      })
                    }}
                  >
                    <div
                      className='text-sm'
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(message.content)
                      }}
                    />
                    {images.map(img => (
                      <Image
                        mah={400}
                        maw={400}
                        key={img.url}
                        className='rounded'
                        src={img.url}
                      />
                    ))}
                  </div>
                </div>
              </HoverCard.Target>
              <HoverCard.Dropdown className='h-10 p-1'>
                <ActionIcon />
              </HoverCard.Dropdown>
            </HoverCard>
          )
        })}

        {/* <p className='text-xs leading-3 text-gray-500'>
          {dayjs(
            messageGroup.messages[messageGroup.messages.length - 1].createdAt
          ).format('YYYY-MM-DD HH:mm:ss')}
        </p> */}
      </MessageStyle>
    </div>
  )
}
