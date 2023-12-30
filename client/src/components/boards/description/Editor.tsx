import { Link, RichTextEditor } from '@mantine/tiptap'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Mention from '@tiptap/extension-mention'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import useAppParams from '../../../hooks/useAppParams.js'
import { useAppSelector } from '../../../redux/store.js'
import { useAppMutation } from '../../../services/apis/useAppMutation.js'
import suggestion from '../../message/suggestion.js'

const content =
  '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>'

export default function Editor() {
  const { boardId, cardId } = useAppParams()
  const card = useAppSelector(state => state.workspace.cards[cardId!])
  // const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
  //   headers: {
  //     'Content-Type': undefined
  //   }
  // })
  const { mutateAsync: updateCard } = useAppMutation('updateCard')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
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

    content,
    onBlur({ editor }) {
      if (!boardId) return
      if (!cardId) return

      updateCard({
        url: {
          baseUrl: '/workspace/boards/:boardId/cards/:cardId',
          urlParams: {
            boardId,
            cardId
          }
        },
        method: 'patch',
        payload: { data: editor.getJSON() }
      })
    }
  })

  useEffect(() => {
    if (!card) return
    if (!card.data) return
    if (!editor) return
    editor.chain().setContent(card.data).run()
  }, [card, editor])

  return (
    <RichTextEditor
      editor={editor}
      //   className='rounded rounded-none border-dashed border-none'
    >
      {editor?.isEditable && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ arrow: true, placement: 'bottom-start' }}
        >
          <RichTextEditor.Toolbar className='shadow-custom gap-2 rounded border-none p-3'>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
              <RichTextEditor.CodeBlock />

              {/* <FileButton
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
                      editor.chain().focus().setImage({ src: data.url }).run()
                    })
                    .catch(error => {
                      console.error('File upload failed', error)
                    })
                }}
                accept='image/png,image/jpeg'
              >
                {({ onClick }) => <ActionIcon onClick={onClick} />}
              </FileButton> */}
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>
        </BubbleMenu>
      )}

      <RichTextEditor.Content />
    </RichTextEditor>
  )
}
