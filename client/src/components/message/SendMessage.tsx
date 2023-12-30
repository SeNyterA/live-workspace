import { Badge, Button, Divider, FileButton } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import '@mantine/tiptap/styles.css'
import { IconPaperclip, IconSend, IconX } from '@tabler/icons-react'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useTyping from '../../hooks/useTyping'
import { TThread } from '../../Layout'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import { EMessageFor } from '../../types/workspace.type'
import { formatFileName, removeHtmlTags } from '../new-message/helper'
import suggestion from './suggestion.js'
import Typing from './Typing'

const getApiInfo = (targetType: EMessageFor) => {
  switch (targetType) {
    case EMessageFor.Direct:
      return 'createDirectMessage'
    case EMessageFor.Group:
      return 'createGroupMessage'
    default:
      return 'createChannelMessage'
  }
}

export default function SendMessage({
  targetId,
  targetType,
  thread
}: {
  targetId: string
  targetType: EMessageFor
  thread?: TThread
}) {
  const dispatch = useDispatch()
  const keyApi = getApiInfo(targetType)
  const [files, setFiles] = useState<string[]>([])

  const socketEmit = useAppEmitSocket()
  const typing = useTyping()

  const { mutateAsync: createMessMutation } = useAppMutation(keyApi)
  const _createMessage = () => {
    if (
      removeHtmlTags(editor?.getHTML() || '').trim() === '' &&
      files.length === 0
    )
      return
    const value = editor?.getHTML()

    if (keyApi === 'createChannelMessage')
      createMessMutation(
        {
          url: {
            baseUrl: '/workspace/channels/:channelId/messages',
            urlParams: {
              channelId: targetId
            }
          },
          method: 'post',
          payload: {
            content: value,
            attachments: files,
            ...(thread && {
              replyRootId: thread?.threadId,
              replyToMessageId: thread?.threadId
            })
          }
        },
        {
          onSuccess(message) {
            dispatch(workspaceActions.addMessages({ [message._id]: message }))
            socketEmit({
              key: 'stopTyping',
              targetId: targetId
            })
          }
        }
      )

    if (keyApi === 'createGroupMessage')
      createMessMutation(
        {
          url: {
            baseUrl: '/workspace/groups/:groupId/messages',
            urlParams: {
              groupId: targetId
            }
          },
          method: 'post',
          payload: {
            content: value,
            attachments: files
          }
        },
        {
          onSuccess(message) {
            dispatch(workspaceActions.addMessages({ [message._id]: message }))
            socketEmit({
              key: 'stopTyping',
              targetId: targetId
            })
          }
        }
      )

    if (keyApi === 'createDirectMessage')
      createMessMutation(
        {
          url: {
            baseUrl: '/workspace/direct-messages/:targetId/messages',
            urlParams: {
              targetId: targetId
            }
          },
          method: 'post',
          payload: {
            content: value,
            attachments: files
          }
        },
        {
          onSuccess(message) {
            dispatch(
              workspaceActions.addMessages({
                [message._id]: message
              })
            )

            socketEmit({
              key: 'stopTyping',
              targetId: targetId
            })
          }
        }
      )

    setFiles([])
    editor?.commands.clearContent(true)
    editor?.commands.focus()
  }

  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    headers: {
      'Content-Type': undefined
    }
  })

  const editor = useEditor({
    onUpdate({}) {
      typing(targetId)
    },

    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'This is placeholder' }),

      Mention.configure({
        HTMLAttributes: {
          class: 'mention'
        },
        suggestion
      })
    ]
  })

  return (
    <div className='relative h-28'>
      <div className='absolute bottom-6 left-2 right-2 z-10 rounded-md border border-dashed border-gray-300 bg-white'>
        <RichTextEditor editor={editor} className='border-none'>
          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{ arrow: true, placement: 'top-start' }}
            >
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Highlight />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.Link />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                {/* <RichTextEditor.Code /> */}
              </RichTextEditor.ControlsGroup>
            </BubbleMenu>
          )}
          <RichTextEditor.Content
            style={{
              overflowY: 'auto',
              maxHeight: 300
            }}
            className='customscroll'
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.altKey || e.metaKey)) {
                _createMessage()
              }
            }}
          />
        </RichTextEditor>

        <div className='flex items-center justify-end gap-1 px-2 pb-2'>
          {files.map(file => (
            <Badge
              key={file}
              variant='transparent'
              className='h-[26px] rounded bg-gray-100'
              rightSection={
                <IconX
                  size={14}
                  className='cursor-pointer'
                  onClick={() =>
                    setFiles(files => files.filter(e => e !== file))
                  }
                ></IconX>
              }
            >
              {formatFileName(file)}
            </Badge>
          ))}
          <FileButton
            multiple
            onChange={async files => {
              const _filesUploaded = files.map(file => {
                const formData = new FormData()
                formData.append('file', file)

                return uploadFile({
                  method: 'post',
                  isFormData: true,
                  url: {
                    baseUrl: '/upload'
                  },
                  payload: { file }
                })
                  .then(data => {
                    console.log(data)
                    setFiles(files => [...files, data.url])
                  })
                  .catch(error => {
                    console.error('File upload failed', error)
                  })
              })

              await Promise.all(_filesUploaded)
            }}
            accept='image/png,image/jpeg'
          >
            {props => (
              <Button size='compact-sm' variant='white' {...props}>
                <IconPaperclip size={16} />
              </Button>
            )}
          </FileButton>
          <Divider orientation='vertical' />
          <Button
            variant='light'
            size='compact-sm'
            onClick={() => {
              _createMessage()
            }}
          >
            <IconSend size={16} />
          </Button>
        </div>
      </div>

      <p className='absolute bottom-1 left-4 right-3 flex justify-between text-xs text-gray-500'>
        <Typing messRefId={targetId} />
        <span>
          Press <kbd className='bg-gray-100'>⌘Enter</kbd> or{' '}
          <kbd className='bg-gray-100'>Alt Enter</kbd> to quickly send
        </span>
      </p>
    </div>
  )
}
