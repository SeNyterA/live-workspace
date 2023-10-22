import { Avatar, Divider, Menu, ScrollArea } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import Editor from './new-message/NewMessage'

export default function MessageContent() {
  const [messes, setMesses] = useState<{ content: string; isOwner: boolean }[]>(
    []
  )
  const [id, setId] = useState('')

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
    <div className='flex-1 flex flex-col'>
      <div className='h-12 bg-slate-500'></div>

      <div className='flex-1 relative'>
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
              className='mt-3 bg-gray-50 rounded'
              key={index}
              ref={targetRef}
            >
              <Menu withArrow>
                <Menu.Target>
                  <Avatar />
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<IconSearch />} disabled>
                    Search
                  </Menu.Item>

                  {/* Other items ... */}
                </Menu.Dropdown>
              </Menu>
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
      <Divider variant='dashed'/>
      <Editor
        onSubmit={value =>
          setMesses([
            ...messes,
            { content: value || '', isOwner: !!(Math.random() > 0.5) }
          ])
        }
      />
    </div>
  )
}
