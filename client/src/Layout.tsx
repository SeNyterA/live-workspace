import {
  ActionIcon,
  Avatar,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Textarea,
  TextInput
} from '@mantine/core'
import { ReactNode, useState } from 'react'
import AppHeader from './components/layouts/AppHeader'
import Sidebar from './components/layouts/Sidebar'

export default function Layout({ children }: { children: ReactNode }) {
  const [openDrawer, toggleDrawer] = useState(false)
  return (
    <>
      <div className='flex h-screen w-screen flex-col text-sm'>
        <AppHeader />
        <Divider variant='dashed' />
        <div className='flex flex-1'>
          <div className='flex h-full w-[56px] flex-col justify-center gap-2 py-2'>
            <ActionIcon
              className='mx-2 flex h-fit w-fit items-center justify-center rounded-full p-0'
              variant='subtle'
            >
              <Avatar />
            </ActionIcon>

            <Divider variant='dashed' className='mx-4' />
            <div className='relative flex-1'>
              <ScrollArea className='absolute inset-0 px-2' scrollbarSize={6}>
                {Array(10)
                  .fill(1)
                  .map((_, index) => (
                    <ActionIcon
                      key={index}
                      className='mt-1 flex h-fit w-fit items-center justify-center rounded-full p-0 first:mt-0'
                      variant='subtle'
                    >
                      <Avatar key={index} />
                    </ActionIcon>
                  ))}
              </ScrollArea>
            </div>
            <Divider variant='dashed' className='mx-4' />

            <ActionIcon
              className='mx-2 flex h-fit w-fit items-center justify-center rounded-full p-0'
              variant='subtle'
              onClick={() => {
                toggleDrawer(true)
              }}
            >
              <Avatar />
            </ActionIcon>
          </div>

          <Divider variant='dashed' orientation='vertical' />
          <div className='flex flex-1'>
            <Sidebar />
            <Divider variant='dashed' orientation='vertical' />
            {children}
          </div>
        </div>
      </div>

      <Drawer.Root
        opened={openDrawer}
        onClose={() => toggleDrawer(false)}
        position='left'
      >
        <Drawer.Overlay color='#000' backgroundOpacity={0.35} blur={15} />
        <Drawer.Content className='rounded-lg p-8'>
          <div className='flex h-full w-full flex-col justify-between'>
            <div>
              <p className='text-2xl font-semibold'>Create team</p>

              <TextInput
                label='Name'
                placeholder='Team name'
                radius='md'
                className='mt-3'
                description='This is anosssssssssssnymous'
              />
              <Textarea
                label='Description'
                placeholder='description for team ...'
                radius='md'
                error={'sssss'}
                className='mt-3'
                description='This is anosssssssssssnymous'
              />
              <TextInput
                label='Display url'
                placeholder='Team name'
                radius='md'
                className='mt-3'
                description='This is anosssssssssssnymous'
              />

              <Checkbox.Group
                defaultValue={['react']}
                label='Select default channel'
                description='This is anosssssssssssnymous'
                error='sssssssssssssss'
                className='mt-3'
              >
                <Group mt='xs'>
                  <Checkbox value='react' label='React' />
                  <Checkbox value='svelte' label='Svelte' />
                  <Checkbox value='ng' label='Angular' />
                  <Checkbox value='vue' label='Vue' />
                </Group>
              </Checkbox.Group>
            </div>
            <div className='flex items-center gap-10'>
              <Button variant='default'>Close</Button>
              <Button variant='filled' color='dark'>
                Create
              </Button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
