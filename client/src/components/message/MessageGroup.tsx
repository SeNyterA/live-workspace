import { ActionIcon, Avatar, Image } from '@mantine/core'
import { Link } from '@mantine/tiptap'
import { IconMessageReply, IconTrash } from '@tabler/icons-react'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useLayout } from '../../Layout'
import { useAppSelector } from '../../redux/store'
import Watching from '../../redux/Watching'
import { EMessageType } from '../../types/workspace.type'
import { updateLabelMention } from '../../utils/helper'
import { groupByFileType } from '../new-message/helper'
import UserDetailProvider from '../user/UserDetailProvider'
import { TGroupedMessage } from './MessageContentProvider'

export default function MessageGroup({
  messageGroup,
  classNames
}: {
  messageGroup: TGroupedMessage
  classNames?: { wrapper?: string }
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
      className={`my-3 flex gap-2 px-4 first:mt-8 ${
        isOwner ? 'justify-end' : 'justify-start'
      } ${classNames?.wrapper}`}
    >
      {!isOwner && (
        <UserDetailProvider user={createdByUser}>
          <Avatar />
        </UserDetailProvider>
      )}

      <div className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
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
            <div
              className={`mt-1 flex max-w-[300px] flex-col first:mt-0 ${
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
                      className='line-clamp-1 h-4 max-w-96 cursor-pointer truncate !bg-transparent text-xs !text-blue-400 hover:underline'
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          generateHTML(
                            updateLabelMention(
                              data?.replyMessage?.content || {}
                            ),
                            [
                              StarterKit,
                              Underline,
                              Link,
                              Highlight,
                              TextAlign,
                              Mention
                            ]
                          )
                        )
                      }}
                    />
                  )}
                </Watching>
              )}

              <div
                className='group relative w-fit cursor-pointer rounded bg-gray-100 p-1'
                key={message._id}
              >
                <div
                  className={`absolute top-0 z-10 hidden h-10 translate-y-[-100%] items-center justify-center gap-1 rounded bg-white px-2 shadow-custom group-hover:flex ${
                    isOwner ? 'right-0' : 'left-0'
                  }`}
                >
                  <ActionIcon variant='light' color='gray' />
                  <ActionIcon variant='light' color='gray' />
                  <ActionIcon variant='light' color='gray' />

                  <ActionIcon
                    variant='light'
                    color='gray'
                    onClick={() => {
                      updateThread({
                        targetId: message.messageReferenceId,
                        targetType: message.messageFor,
                        threadId: message.replyRootId || message._id
                      })
                    }}
                  >
                    <IconMessageReply size={18} />
                  </ActionIcon>
                  <ActionIcon variant='light' color='gray'>
                    <IconTrash size={18} />
                  </ActionIcon>
                </div>
                <div
                  className='text-sm'
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      generateHTML(updateLabelMention(message.content), [
                        StarterKit,
                        Underline,
                        Link,
                        Highlight,
                        TextAlign,
                        Mention
                      ])
                    )
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
          )
        })}
      </div>
    </div>
  )
}
