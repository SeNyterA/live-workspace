import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ActionIcon, Avatar, Image, Menu } from '@mantine/core'
import { Link } from '@mantine/tiptap'
import {
  IconBrandThreads,
  IconEdit,
  IconMessageReply,
  IconMoodPlus,
  IconPin,
  IconTrash
} from '@tabler/icons-react'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { generateHTML } from '@tiptap/html'
import StarterKit from '@tiptap/starter-kit'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../redux/store'
import Watching from '../../../redux/Watching'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { EMessageType } from '../../../types'
import { updateLabelMention } from '../../../utils/helper'
import { useLayout } from '../../layout/Layout'
import { groupByFileType } from '../../new-message/helper'
import { TGroupedMessage } from './MessageContentProvider'

export default function MessageGroup({
  messageGroup,
  classNames,
  scrollableRef
}: {
  messageGroup: TGroupedMessage
  classNames?: { wrapper?: string }
  scrollableRef?: React.RefObject<HTMLDivElement>
}) {
  const { updateThread } = useLayout()
  const [emojiId, toogleImojiId] = useState<string>()
  const createdByUser = useAppSelector(state =>
    Object.values(state.workspace.users).find(
      e => e._id === messageGroup.userId
    )
  )

  const { mutateAsync: reactWorkspaceMessage } = useAppMutation(
    'reactWorkspaceMessage'
  )
  const { mutateAsync: deleteWorkspaceMessage } = useAppMutation(
    'deleteWorkspaceMessage'
  )
  const { mutateAsync: pinWorkspaceMessage } = useAppMutation(
    'pinWorkspaceMessage'
  )

  const isOwner = useAppSelector(state => {
    return (
      state.auth.userInfo?._id === messageGroup.userId &&
      messageGroup.messages[0].type === EMessageType.Normal
    )
  })

  useEffect(() => {
    if (!scrollableRef?.current) return
    scrollableRef.current.style.overflow = emojiId ? 'hidden' : 'auto'
  }, [emojiId, scrollableRef])

  return (
    <div
      className={`my-3 flex gap-2 px-4 first:mt-8 ${
        isOwner ? 'justify-end' : 'justify-start'
      } ${classNames?.wrapper}`}
    >
      {!isOwner && (
        // <UserDetailProvider user={createdByUser}>
        <Avatar
          src={createdByUser?.avatar?.path}
          size={32}
          className='ring-1 ring-offset-1'
        />
        // </UserDetailProvider>
      )}

      <div className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}>
        {!isOwner && (
          <p className='font-medium'>
            {messageGroup.messages[0].type === EMessageType.System
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
          const { images } = groupByFileType(
            message.attachments?.map(e => e.path) || []
          )

          return (
            <div
              key={message._id}
              className={`mt-1 flex max-w-[500px] flex-col first:mt-0 ${
                isOwner && 'items-end'
              }`}
            >
              {!!message.replyToId && (
                <Watching
                  watchingFn={state => ({
                    replyMessage: state.workspace.messages[message.replyToId!],
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

              <Menu
                onClose={() => {
                  toogleImojiId(undefined)
                }}
                opened={emojiId === message._id}
                position='bottom-end'
                offset={0}
              >
                <Menu.Target>
                  <div className='bg-black'></div>
                </Menu.Target>

                <Menu.Dropdown className='overflow-hidden rounded-lg p-0 shadow-none'>
                  <Picker
                    data={data}
                    onEmojiSelect={(data: any) => {
                      // console.log(String.fromCodePoint(Number('0x1f618')))
                      reactWorkspaceMessage({
                        url: {
                          baseUrl:
                            '/workspaces/:workspaceId/messages/:messageId/reaction',
                          urlParams: {
                            messageId: message._id,
                            workspaceId: message.targetId
                          }
                        },
                        method: 'post',
                        payload: { reaction: data.shortcodes }
                      })

                      toogleImojiId(undefined)
                    }}
                  />
                </Menu.Dropdown>
              </Menu>

              <div
                className={`group relative w-fit rounded bg-gray-100 p-1 ${
                  message.replyToId && 'cursor-pointer'
                }`}
                key={message._id}
              >
                <div
                  className={`absolute top-0 z-10 hidden h-10 translate-y-[-100%] items-center justify-center gap-1 rounded bg-white px-2 shadow-custom group-hover:flex ${
                    isOwner ? 'right-0' : 'left-0'
                  }`}
                >
                  <ActionIcon
                    variant='light'
                    className='text-gray-600 hover:text-gray-800'
                    onClick={() => {
                      toogleImojiId(message._id)
                    }}
                  >
                    <IconMoodPlus size={18} />
                  </ActionIcon>

                  <ActionIcon
                    variant='light'
                    className='text-gray-600 hover:text-gray-800'
                  >
                    <IconEdit size={18} />
                  </ActionIcon>

                  <ActionIcon
                    variant='light'
                    className='text-gray-600 hover:text-gray-800'
                    onClick={() => {
                      pinWorkspaceMessage({
                        method: 'post',
                        url: {
                          baseUrl:
                            '/workspaces/:workspaceId/messages/:messageId/pin',
                          urlParams: {
                            messageId: message._id,
                            workspaceId: message.targetId
                          }
                        }
                      })
                    }}
                  >
                    <IconPin size={18} />
                  </ActionIcon>

                  <ActionIcon
                    variant='light'
                    className='text-gray-600 hover:text-gray-800'
                    onClick={() => {
                      updateThread({
                        targetId: message.targetId,
                        threadId: message.threadId || message._id
                      })
                    }}
                  >
                    <IconBrandThreads size={18} />
                  </ActionIcon>

                  <ActionIcon
                    variant='light'
                    className='text-gray-600 hover:text-gray-800'
                    onClick={() => {
                      updateThread({
                        targetId: message.targetId,
                        threadId: message.threadId || message._id,
                        replyId: message._id
                      })
                    }}
                  >
                    <IconMessageReply size={18} />
                  </ActionIcon>
                  <ActionIcon
                    variant='light'
                    className='text-gray-600 hover:text-gray-800'
                    onClick={() => {
                      deleteWorkspaceMessage({
                        method: 'delete',
                        url: {
                          baseUrl:
                            '/workspaces/:workspaceId/messages/:messageId',
                          urlParams: {
                            messageId: message._id,
                            workspaceId: message.targetId
                          }
                        }
                      })
                    }}
                  >
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

                {!!Object.values(message.reactions || {}).length && (
                  <div className='mt-1 flex gap-1'>
                    {Object.values(message.reactions || {}).map(e => (
                      <span
                        className='cursor-pointer rounded bg-white p-[2px] text-sm hover:ring-1'
                        onClick={() => {
                          reactWorkspaceMessage({
                            url: {
                              baseUrl:
                                '/workspaces/:workspaceId/messages/:messageId/reaction',
                              urlParams: {
                                messageId: message._id,
                                workspaceId: message.targetId
                              }
                            },
                            method: 'post',
                            payload: { reaction: e }
                          })
                        }}
                      >
                        {/* @ts-ignore */}
                        <em-emoji shortcodes={e}></em-emoji>
                        <span className='text-gray-500'> 1</span>
                      </span>
                    ))}
                    <Menu
                      onClose={() => {
                        toogleImojiId(undefined)
                      }}
                      position='bottom-end'
                      offset={0}
                    >
                      <Menu.Target>
                        <ActionIcon
                          variant='light'
                          className='bg-white text-gray-600 opacity-0 hover:text-gray-800 hover:ring-1 group-hover:opacity-100'
                          size={24}
                        >
                          <IconMoodPlus size={18} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown className='overflow-hidden rounded-lg p-0 shadow-none'>
                        <Picker
                          data={data}
                          onEmojiSelect={(data: any) => {
                            reactWorkspaceMessage({
                              url: {
                                baseUrl:
                                  '/workspaces/:workspaceId/messages/:messageId/reaction',
                                urlParams: {
                                  messageId: message._id,
                                  workspaceId: message.targetId
                                }
                              },
                              method: 'post',
                              payload: { reaction: data.native }
                            })

                            toogleImojiId(undefined)
                          }}
                        />
                      </Menu.Dropdown>
                    </Menu>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
