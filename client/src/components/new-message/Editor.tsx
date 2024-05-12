import { ActionIcon } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import { IconSend } from '@tabler/icons-react'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { BubbleMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { removeHtmlTags } from './helper'

type Props = {
  onChange?: (e?: string) => void
  onSubmit?: (value?: string) => void
}

export default function Editor({ onChange, onSubmit }: Props) {
  const editor = useEditor({
    onUpdate({ editor }) {
      onChange && onChange(editor.getHTML())
    },

    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
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
    ]
  })

  return (
    <div className='flex items-end'>
      <RichTextEditor editor={editor} className='flex-1 border-none'>
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
              {/* <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight /> */}
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
              onSubmit && onSubmit(editor?.getHTML())

              editor?.commands.clearContent(true)
            }
          }}
        />
      </RichTextEditor>

      <ActionIcon
        className='mx-2 my-2'
        onClick={() => {
          if (removeHtmlTags(editor?.getHTML() || '').trim() !== '') {
            onSubmit && onSubmit(editor?.getHTML())

            editor?.commands.clearContent(true)
            editor?.commands.focus()
          }
        }}
      >
        <IconSend />
      </ActionIcon>
    </div>
  )
}
