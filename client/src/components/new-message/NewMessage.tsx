import { ActionIcon } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import '@mantine/tiptap/styles.css'
import { IconSend } from '@tabler/icons-react'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import SubScript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { removeHtmlTags } from './helper'

// const content =
//   '<h2 style="text-align: center;">Welcome to Mantine rich text editor</h2><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>'

const content = ''

type Props = {
  onChange?: (e?: string) => void
  onSubmit?: (value?: string) => void
}

export default function Editor({
  onChange = () => {},
  onSubmit = () => {}
}: Props) {
  const editor = useEditor({
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },

    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'This is placeholder' })
      // Mention.configure({
      //   HTMLAttributes: { class: 'mentionNode' },
      //   suggestion: {
      //     render: () => {
      //       let reactRenderer: ReactRenderer

      //       return {
      //         onStart: props => {
      //           reactRenderer = new ReactRenderer(MentionList, {
      //             props,
      //             editor: props.editor
      //           })
      //         },

      //         onUpdate(props) {
      //           reactRenderer?.updateProps(props)
      //         },

      //         onKeyDown(props) {
      //           if (props.event.key === 'Escape') {
      //             reactRenderer?.destroy()
      //             return true
      //           }

      //           return (reactRenderer?.ref as any)?.onKeyDown(props)
      //         },

      //         onExit() {
      //           reactRenderer.destroy()
      //         }
      //       }
      //     }
      //   }
      // })
    ],
    content
  })

  return (
    <RichTextEditor editor={editor} className='w-full border-none'>
      <RichTextEditor.Content
        mah={300}
        style={{
          overflowY: 'auto'
        }}
        onKeyDown={e => {
          if (
            e.key === 'Enter' &&
            (e.altKey || e.metaKey) &&
            removeHtmlTags(editor?.getHTML() || '').trim() !== ''
          ) {
            onSubmit(editor?.getHTML())

            editor?.commands.clearContent(true)
          }
        }}
      />

      <div className='flex justify-between'>
        <RichTextEditor.Toolbar className='border-none' sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.Highlight />
            {/* <RichTextEditor.Code /> */}
            <RichTextEditor.ClearFormatting />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            {/* <RichTextEditor.Blockquote /> */}
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            {/* <RichTextEditor.Subscript />
          <RichTextEditor.Superscript /> */}
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

        <ActionIcon
          variant='default'
          className='mx-2 my-2'
          onClick={() => {
            if (removeHtmlTags(editor?.getHTML() || '').trim() !== '') {
              onSubmit(editor?.getHTML())

              editor?.commands.clearContent(true)
              editor?.commands.focus()
            }
          }}
        >
          <IconSend />
        </ActionIcon>
      </div>
    </RichTextEditor>
  )
}
