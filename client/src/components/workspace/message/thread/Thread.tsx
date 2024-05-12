import { Drawer, ScrollArea } from '@mantine/core'
import { Link } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { generateHTML } from '@tiptap/html'
import { JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import DOMPurify from 'dompurify'
import { Fragment } from 'react'
import { useAppSelector } from '../../../../redux/store'
import Watching from '../../../../redux/Watching'
import { TFile } from '../../../../types'
import { updateLabelMention } from '../../../../utils/helper'
import { TThread, useLayout } from '../../../layout/Layout'
import SendMessage from '../create-message/SendMessage'
import { groupMessages } from '../MessageContentProvider'
import MessageGroup from '../MessageGroup'

export default function Thread({
  createMessage
}: {
  createMessage: ({
    files,
    value,
    thread
  }: {
    value?: JSONContent
    files: TFile[]
    thread: TThread
  }) => void
}) {
  const { updateThread, thread } = useLayout()

  const threadMessages = useAppSelector(state =>
    Object.values(state.workspace.messages).filter(
      m => m.id === thread?.threadId || m.threadToId === thread?.threadId
    )
  )

  if (!thread) return <Fragment />

  return (
    <Drawer
      onClose={() => {
        updateThread(undefined)
      }}
      opened={!!thread}
      title={<p className='text-lg font-semibold'>Thread</p>}
      position='right'
      classNames={{
        body:'p-0'
      }}
      overlayProps={{
        blur: '0.5'
      }}
    >
      <div className='relative flex-1'>
        <ScrollArea className='absolute inset-0' scrollbarSize={8}>
          {groupMessages(threadMessages || []).map(groupMessage => (
            <MessageGroup
              key={groupMessage.messages[0].id}
              messageGroup={groupMessage}
            />
          ))}
        </ScrollArea>
      </div>

      {!!thread.replyId && (
        <Watching
          watchingFn={state => ({
            replyMessage: state.workspace.messages[thread.replyId!]
          })}
        >
          {data => (
            <div
              className='! mb-1 ml-5 line-clamp-1 h-4 w-fit max-w-96 cursor-pointer truncate !bg-transparent text-sm hover:underline'
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
      <SendMessage
        classNames={{
          editorWrapper: '',
          infoWrapper: '!left-4 !right-4',rootWrapper: 'px-4'
        }}
        targetId={thread.targetId}
        createMessage={data =>
          createMessage({
            ...data,
            thread
          })
        }
      />
    </Drawer>
  )
}
