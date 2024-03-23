import { Badge, Button, Divider, FileButton } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import '@mantine/tiptap/styles.css'
import { IconPaperclip, IconSend, IconX } from '@tabler/icons-react'
import Highlight from '@tiptap/extension-highlight'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import {
  BubbleMenu,
  JSONContent,
  ReactRenderer,
  useEditor
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import tippy from 'tippy.js'
import useTyping from '../../../../hooks/useTyping'
import { getAppValue } from '../../../../redux/store'
import { useAppMutation } from '../../../../services/apis/mutations/useAppMutation'
import { TFile } from '../../../../types'
import MentionList from '../MentionList'
import Typing from '../Typing'

type TSendMessage = {
  targetId: string
  createMessage: ({
    files,
    value
  }: {
    value?: JSONContent
    files: TFile[]
  }) => void
  classNames?: {
    editorWrapper?: string
    infoWrapper?: string
    rootWrapper?: string
  }
}

export default function SendMessage({
  targetId,
  classNames,
  createMessage
}: TSendMessage) {
  const [files, setFiles] = useState<TFile[]>([])

  const typing = useTyping()

  const _createMessage = async () => {
    if (!editor?.getText().trim() && files.length === 0) return
    const value = editor?.getJSON()

    createMessage({ files, value })

    setFiles([])
    editor?.commands.clearContent(true)
    editor?.commands.focus()
  }

  const { mutateAsync: uploadFile, isPending } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    }
  })

  const uploadFiles = async (files: File[]) => {
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
          setFiles(files => [...files, data])
        })
        .catch(error => {
          console.error('File upload failed', error)
        })
    })

    await Promise.all(_filesUploaded)
  }

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

        suggestion: {
          items: ({ query }) => {
            const members = getAppValue(state =>
              Object.values(state.workspace.members)
            )
            const usersId = members?.map(e => e.userId)

            return (
              getAppValue(state =>
                Object.values(state.workspace.users).filter(u =>
                  usersId?.includes(u.id)
                )
              ) || []
            )
              ?.filter(item =>
                item.userName.toLowerCase().startsWith(query.toLowerCase())
              )
              .slice(0, 5)
          },

          render: () => {
            let component: any
            let popup: any

            return {
              onStart: props => {
                component = new ReactRenderer(MentionList, {
                  props,
                  editor: props.editor
                })

                if (!props.clientRect) {
                  return
                }

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect as any,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'auto-start'
                })
              },

              onUpdate(props) {
                component.updateProps(props)

                if (!props.clientRect) {
                  return
                }

                popup[0].setProps({
                  getReferenceClientRect: props.clientRect
                })
              },

              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  popup[0].hide()

                  return true
                }

                return component.ref?.onKeyDown(props)
              },

              onExit() {
                popup[0].destroy()
                component.destroy()
              }
            }
          }
        }
      })
    ],

    editorProps: {
      handlePaste(view, event, slice) {},
      handleDrop: (view, event, slice, moved) => {
        event.preventDefault()
        event.stopPropagation()

        if (!moved && event.dataTransfer && event.dataTransfer.files) {
          const files = Object.values(event.dataTransfer.files)
          uploadFiles(files)
        }
        return false
      }
    }
  })

  return (
    <div className={`rootWrapper relative h-28 ${classNames?.rootWrapper}`}>
      <div
        className={`editorWapper absolute bottom-6 left-2 right-2 z-10 rounded-md border border-dashed border-gray-200/40 ${classNames?.editorWrapper}`}
      >
        <RichTextEditor
          editor={editor}
          className='border-none text-sm'
          classNames={{
            content: 'bg-transparent border-none text-sm'
          }}
        >
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
              </RichTextEditor.ControlsGroup>
            </BubbleMenu>
          )}
          <RichTextEditor.Content
            style={{
              overflowY: 'auto',
              maxHeight: 300
            }}
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
              key={file.id}
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
              {file.name}
            </Badge>
          ))}
          <FileButton
            multiple
            onChange={files => {
              uploadFiles(files)
            }}
            accept='image/png,image/jpeg'
            disabled={isPending}
          >
            {props => (
              <Button
                size='compact-sm'
                variant='transparent'
                className='bg-blue-400/20'
                {...props}
                loading={isPending}
              >
                <IconPaperclip size={16} />
              </Button>
            )}
          </FileButton>
          <Divider orientation='vertical' />
          <Button
            variant='transparent'
            size='compact-sm'
            className='bg-blue-400/20'
            onClick={() => {
              _createMessage()
            }}
          >
            <IconSend size={16} />
          </Button>
        </div>
      </div>

      <p
        className={`info-wrapper absolute bottom-1 left-4 right-3 flex justify-between text-xs text-gray-500 ${classNames?.infoWrapper}`}
      >
        <Typing messRefId={targetId} />
        <span>
          Press <kbd className='bg-gray-100'>⌘Enter</kbd> or{' '}
          <kbd className='bg-gray-100'>Alt Enter</kbd> to quickly send
        </span>
      </p>
    </div>
  )
}
