import { ActionIcon } from '@mantine/core'
import { Link, RichTextEditor } from '@mantine/tiptap'
import { IconSend } from '@tabler/icons-react'
import { BubbleMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: '<p>Select some text to see bubble menu</p>'
  })

  return (
    <div className='flex'>
      <RichTextEditor editor={editor} className='w-full border-none flex-1'>
        {editor && (
          <BubbleMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.Link />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
        )}
        <RichTextEditor.Content />
      </RichTextEditor>

      <ActionIcon
          variant='default'
          className='mx-2 my-2'
         
        >
          <IconSend />
        </ActionIcon>
    </div>
  )
}
