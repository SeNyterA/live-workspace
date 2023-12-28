import { ActionIcon, Badge, Button, Divider, FileButton } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import '@mantine/tiptap/styles.css'
import { IconPaperclip, IconSend, IconX } from '@tabler/icons-react'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import useTyping from '../../hooks/useTyping'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import {
  ApiMutationType,
  useAppMutation
} from '../../services/apis/useAppMutation'
import { useAppEmitSocket } from '../../services/socket/useAppEmitSocket'
import { formatFileName, removeHtmlTags } from '../new-message/helper'
import {
  TMessageContentValue,
  TTargetMessageId
} from './MessageContentProvider'
import Typing from './Typing'

const getApiInfo = (
  targetId: TTargetMessageId
): {
  typeApi: 'channel' | 'direct' | 'group'
  keyApi: keyof Pick<
    ApiMutationType,
    'createChannelMessage' | 'createDirectMessage' | 'createGroupMessage'
  >
  messRefId?: string
} => {
  if (targetId.channelId) {
    return {
      keyApi: 'createChannelMessage',
      messRefId: targetId.channelId,
      typeApi: 'channel'
    }
  }
  if (targetId.directId) {
    return {
      keyApi: 'createDirectMessage',
      messRefId: targetId.directId,
      typeApi: 'direct'
    }
  }

  if (targetId.groupId) {
    return {
      keyApi: 'createGroupMessage',
      messRefId: targetId.groupId,
      typeApi: 'group'
    }
  }

  return {
    keyApi: 'createDirectMessage',
    messRefId: '',
    typeApi: 'direct'
  }
}

export default function SendMessage({
  targetId,
  userTargetId
}: Pick<TMessageContentValue, 'userTargetId' | 'targetId'>) {
  const dispatch = useDispatch()
  const { keyApi, messRefId, typeApi } = getApiInfo(targetId)
  const [files, setFiles] = useState<string[]>([])

  const socketEmit = useAppEmitSocket()
  const typing = useTyping()

  const { mutateAsync: createMessMutation } = useAppMutation(keyApi)
  const _createMessage = (value?: string) => {
    if (!(value || files.length > 0)) return

    if (typeApi === 'channel' && messRefId)
      createMessMutation(
        {
          url: {
            baseUrl: '/workspace/channels/:channelId/messages',
            urlParams: {
              channelId: messRefId
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
              targetId: messRefId
            })
          }
        }
      )

    if (typeApi === 'group' && messRefId)
      createMessMutation(
        {
          url: {
            baseUrl: '/workspace/groups/:groupId/messages',
            urlParams: {
              groupId: messRefId
            }
          },
          method: 'post',
          payload: {
            content: value
          }
        },
        {
          onSuccess(message) {
            dispatch(workspaceActions.addMessages({ [message._id]: message }))

            socketEmit({
              key: 'stopTyping',
              targetId: messRefId
            })
          }
        }
      )

    if (typeApi === 'direct' && userTargetId)
      createMessMutation(
        {
          url: {
            baseUrl: '/workspace/direct-messages/:targetId/messages',
            urlParams: {
              targetId: userTargetId
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
              workspaceActions.addMessages({
                [message._id]: message
              })
            )

            socketEmit({
              key: 'stopTyping',
              targetId: userTargetId
            })
          }
        }
      )
  }

  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    headers: {
      'Content-Type': undefined
    }
  })

  const editor = useEditor({
    onUpdate({}) {
      messRefId && typing(messRefId)
    },

    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'This is placeholder' })
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
                <RichTextEditor.Code />
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
              if (
                e.key === 'Enter' &&
                (e.altKey || e.metaKey) &&
                removeHtmlTags(editor?.getHTML() || '').trim() !== ''
              ) {
                _createMessage(editor?.getHTML())

                editor?.commands.clearContent(true)
              }
            }}
          />
        </RichTextEditor>

        <div className='flex items-center justify-end gap-1 px-2 pb-2'>
          {files.map(file => (
            <Badge
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
              if (removeHtmlTags(editor?.getHTML() || '').trim() !== '') {
                _createMessage(editor?.getHTML())

                editor?.commands.clearContent(true)
                editor?.commands.focus()
              }
            }}
          >
            <IconSend size={16} />
          </Button>
        </div>
      </div>

      <p className='absolute bottom-1 left-4 right-3 flex justify-between text-xs text-gray-500'>
        <Typing messRefId={messRefId} />
        <span>
          Press <kbd className='bg-gray-100'>⌘Enter</kbd> or{' '}
          <kbd className='bg-gray-100'>Alt Enter</kbd> to quickly send
        </span>
      </p>
    </div>
  )
}
