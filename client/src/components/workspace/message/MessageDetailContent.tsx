import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ActionIcon, Menu } from '@mantine/core'
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
import DOMPurify from 'dompurify'
import { memo, useState } from 'react'
import Watching from '../../../redux/Watching'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { TMessage } from '../../../types'
import { updateLabelMention } from '../../../utils/helper'
import { useLayout } from '../../layout/Layout'
import Attachments from './detail/Attachments'
import Reactions from './detail/Reactions'

function MessageDetailContent({
  message,
  isOwner
}: {
  message: TMessage
  isOwner?: boolean
}) {
  const { updateThread } = useLayout()
  const [emojiId, toogleImojiId] = useState<string>()
  const { mutateAsync: reactMessage } = useAppMutation('reactMessage')
  const { mutateAsync: deleteWorkspaceMessage } = useAppMutation(
    'deleteWorkspaceMessage'
  )
  const { mutateAsync: pinWorkspaceMessage } = useAppMutation(
    'pinWorkspaceMessage'
  )

  return (
    <div
      key={message.id}
      id={message.id}
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
              className='! line-clamp-1 h-4 max-w-96 cursor-pointer truncate !bg-transparent text-xs hover:underline'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  generateHTML(
                    updateLabelMention(data?.replyMessage?.content || {}),
                    [StarterKit, Underline, Link, Highlight, TextAlign, Mention]
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
        opened={emojiId === message.id}
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
              console.log(data)
              // console.log(String.fromCodePoint(Number('0x1f618')))
              reactMessage({
                url: {
                  baseUrl: '/workspaces/:workspaceId/messages/:messageId/react',
                  urlParams: {
                    messageId: message.id,
                    workspaceId: message.workspaceId
                  }
                },
                payload: {
                  native: data.native,
                  shortcode: data.shortcodes,
                  unified: data.unified
                },
                method: 'post'
              })

              toogleImojiId(undefined)
            }}
          />
        </Menu.Dropdown>
      </Menu>

      <div
        className={`message-wrapper group relative w-fit rounded  p-1 ${
          !!message.replyToId && 'cursor-pointer'
        }`}
        key={message.id}
      >
        <div
          className={`absolute top-0 z-10 hidden translate-y-[-100%] items-center justify-center gap-1 rounded bg-gray-900 p-1 shadow-custom group-hover:flex ${
            isOwner ? 'right-0' : 'left-0'
          }`}
        >
          <ActionIcon
            className=' bg-slate-800/90 hover:bg-gray-800'
            onClick={() => {
              toogleImojiId(message.id)
            }}
          >
            <IconMoodPlus size={18} />
          </ActionIcon>

          {isOwner && (
            <ActionIcon className=' bg-slate-800/90 hover:bg-gray-800'>
              <IconEdit size={18} />
            </ActionIcon>
          )}

          <ActionIcon
            className=' bg-slate-800/90 hover:bg-gray-800'
            onClick={() => {
              pinWorkspaceMessage({
                method: 'post',
                url: {
                  baseUrl: '/workspaces/:workspaceId/messages/:messageId/pin',
                  urlParams: {
                    messageId: message.id,
                    workspaceId: message.workspaceId
                  }
                }
              })
            }}
          >
            <IconPin size={18} />
          </ActionIcon>

          <ActionIcon
            className=' bg-slate-800/90 hover:bg-gray-800'
            onClick={() => {
              updateThread({
                targetId: message.workspaceId,
                threadId: message.threadToId || message.id
              })
            }}
          >
            <IconBrandThreads size={18} />
          </ActionIcon>

          <ActionIcon
            className=' bg-slate-800/90 hover:bg-gray-800'
            onClick={() => {
              console.log({
                targetId: message.workspaceId,
                threadId: message.threadToId || message.id,
                replyId: message.id
              })
              updateThread({
                targetId: message.workspaceId,
                threadId: message.threadToId || message.id,
                replyId: message.id
              })
            }}
          >
            <IconMessageReply size={18} />
          </ActionIcon>
          {isOwner && (
            <ActionIcon
              className=' bg-slate-800/90 hover:bg-gray-800'
              onClick={() => {
                deleteWorkspaceMessage({
                  method: 'delete',
                  url: {
                    baseUrl: '/workspaces/:workspaceId/messages/:messageId',
                    urlParams: {
                      messageId: message.id,
                      workspaceId: message.workspaceId
                    }
                  }
                })
              }}
            >
              <IconTrash size={18} />
            </ActionIcon>
          )}
        </div>

        <div
          className='cursor-pointer text-sm'
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
        <Attachments messageId={message.id} />
        <Reactions messageId={message.id} workspaceId={message.workspaceId} />
        {message.isPinned && (
          <IconPin
            size={20}
            className='absolute right-0 top-0 translate-x-3 translate-y-[-8px] rounded text-yellow-500'
          />
        )}
        {/* <p
          className={`invisible absolute top-[50%] translate-y-[-50%]  group-hover:visible ${isOwner ? 'left-0 translate-x-[-110%]' : 'right-0 translate-x-[110%]'} text-xs  ${message.isPinned ? 'hidden' : ''}`}
        >
          {dayjs(message.createdAt).format('HH:mm')}
        </p> */}
      </div>
    </div>
  )
}
export default memo(MessageDetailContent)
