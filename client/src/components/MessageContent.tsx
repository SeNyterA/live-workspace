import { Avatar, Divider, Drawer, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import MemberContent from './layouts/MemberContent'
import Editor from './new-message/NewMessage'

export default function MessageContent() {
  const [messes, setMesses] = useState<{ content: string; isOwner: boolean }[]>(
    []
  )
  //   const [id, setId] = useState('')
  const [openDrawer, toggleDrawer] = useState(true)

  const { targetRef, scrollableRef, scrollIntoView } = useScrollIntoView<
    HTMLDivElement,
    HTMLDivElement
  >()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollIntoView()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [messes, scrollIntoView])

  return (
    <>
      <div className='flex flex-1 flex-col'>
        <div className='h-12 bg-slate-500'></div>

        <div className='relative flex-1'>
          <ScrollArea
            className='absolute inset-0 overflow-auto'
            viewportRef={scrollableRef}
            scrollbarSize={6}
            onScrollPositionChange={({ x, y }) => {
              console.log({ x, y })
            }}
          >
            {messes.map((value, index) => (
              <div
                id={`id_${index}`}
                className='mt-3 flex gap-2 pl-4'
                key={index}
                ref={targetRef}
              >
                <Avatar />
                <div className=''>
                  <p className='text-base font-medium'>Senytera</p>
                  <p className='text-xs leading-3 text-gray-500'>1 mins ago</p>
                  <div className='mt-2 rounded bg-gray-50 p-1'>
                    {value.content}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* <div className='flex'>
        <Input value={id} onChange={e => setId(e.target.value)}></Input>
        <Button
          variant='default'
          onClick={() => {
            const element = document.querySelector(`#id_${id}`)
            if (element) {
              ;(targetRef as any).current = element as HTMLDivElement
              scrollIntoView()
            }
          }}
        ></Button>
      </div> */}
        <Divider variant='dashed' />
        <Editor
          onSubmit={value =>
            setMesses([
              ...messes,
              { content: value || '', isOwner: !!(Math.random() > 0.5) }
            ])
          }
        />
      </div>
      <Drawer.Root
        opened={openDrawer}
        onClose={() => toggleDrawer(false)}
        position='right'
      >
        <Drawer.Overlay color='#000' backgroundOpacity={0.35} blur={15} />
        <Drawer.Content className='rounded-lg p-8'>
          <MemberContent />
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
