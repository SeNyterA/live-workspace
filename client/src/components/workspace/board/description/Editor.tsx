import { ActionIcon, FileButton } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import '@mantine/tiptap/styles.css'
import { IconCheckbox, IconPhotoPlus } from '@tabler/icons-react'
import CodeBlock from '@tiptap/extension-code-block'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../../../redux/slices/workspace.slice.js'
import { useAppMutation } from '../../../../services/apis/mutations/useAppMutation.js'
import { extractApi, TCard } from '../../../../types/index.js'
import suggestion from '../../message/create-message/suggestion.js'
import './CodeBlock.scss'
import './Mention.scss'
import './Tasklist.scss'

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>'

export default function Editor({ card }: { card?: TCard }) {
  const dispatch = useDispatch()
  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    }
  })
  const { mutateAsync: updateCard } = useAppMutation('updateCard', {
    mutationOptions: {
      onSuccess(data, variables, context) {
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({
              cards: [data]
            })
          )
        )
      }
    }
  })

  const editor = useEditor({
    // editable: false,

    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'my-custom-class'
        }
      }),
      Placeholder.configure({ placeholder: 'Desciption for card' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention'
        },
        suggestion
      }),

      TaskList.configure({}),
      TaskItem.configure({
        nested: true
      }),

      Image.configure({
        allowBase64: true
      })
    ],
    content: card?.detail,

    onBlur({ editor }) {
      if (!card) return
      if (JSON.stringify(editor.getJSON()) !== JSON.stringify(card.detail)) {
        updateCard({
          url: {
            baseUrl: 'boards/:boardId/cards/:cardId',
            urlParams: {
              boardId: card.workspaceId,
              cardId: card.id
            }
          },
          method: 'patch',
          payload: { card: { detail: editor.getJSON() } as any }
        })
      }
    }
  })

  return (
    <RichTextEditor
      editor={editor}
      className='border-none'
      classNames={{
        content: 'bg-transparent',
        controlsGroup: 'bg-transparent'
      }}
    >
      {editor?.isEditable && (
        // <BubbleMenu
        //   editor={editor}
        //   tippyOptions={{ arrow: true, placement: 'top-start' }}
        // >
        <RichTextEditor.Toolbar
          sticky
          className='gap-0 border-none bg-transparent'
        >
          <RichTextEditor.Bold
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.Italic
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.Underline
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.Strikethrough
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.ClearFormatting
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.Highlight
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.CodeBlock
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />

          <FileButton
            inputProps={{
              value: ''
            }}
            onChange={async file => {
              if (!file) return
              const formData = new FormData()
              formData.append('file', file)

              await uploadFile({
                method: 'post',
                isFormData: true,
                url: {
                  baseUrl: '/upload'
                },
                payload: { file }
              })
                .then(data => {
                  editor.chain().focus().setImage({ src: data.path }).run()
                })
                .catch(error => {
                  console.error('File upload failed', error)
                })
            }}
            accept='image/png,image/jpeg'
          >
            {({ onClick }) => (
              <ActionIcon
                size={26}
                className='m-[2px] border-none  ! hover:bg-blue-400/40 data-[active]:bg-blue-50'
                onClick={onClick}
              >
                <IconPhotoPlus size={16} />
              </ActionIcon>
            )}
          </FileButton>

          <ActionIcon
            size={26}
            onClick={() => {
              editor.chain().focus().toggleTaskList().run()
            }}
            className='m-[2px] border-none  ! hover:bg-blue-400/40 data-[active]:bg-blue-50'
          >
            <IconCheckbox size={16} />
          </ActionIcon>

          <RichTextEditor.H1
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.H2
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.H3
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.H4
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />

          <RichTextEditor.Blockquote
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.Hr
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.BulletList
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.OrderedList
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.Subscript
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.Superscript
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />

          <RichTextEditor.Link
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.Unlink
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />

          <RichTextEditor.AlignLeft
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.AlignCenter
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.AlignJustify
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
          <RichTextEditor.AlignRight
            classNames={{
              control:
                ' border-none m-[2px] hover:bg-blue-400/40 data-[active]:bg-blue-50'
            }}
          />
        </RichTextEditor.Toolbar>
        // </BubbleMenu>
      )}

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
