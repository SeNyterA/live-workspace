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
import { Controller, useForm } from 'react-hook-form'
import AppHeader from './components/layouts/AppHeader'
import Sidebar from './components/layouts/Sidebar'

export default function Layout({ children }: { children: ReactNode }) {
  const [openDrawer, toggleDrawer] = useState(false)
  const { control, handleSubmit } = useForm()
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
          <form
            onSubmit={handleSubmit(data => console.log(data))}
            className='flex h-full w-full flex-col justify-between'
          >
            <div>
              <p className='text-2xl font-semibold'>Create team</p>

              <Controller
                name='teamName'
                control={control}
                rules={{ required: 'Team name is required' }}
                render={({ field, fieldState }) => (
                  <TextInput
                    label='Name'
                    placeholder='Team name'
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error && fieldState.error.message}
                    radius='md'
                  />
                )}
              />

              <Controller
                name='description'
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field, fieldState }) => (
                  <Textarea
                    label='Description'
                    placeholder='Description for team ...'
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error && fieldState.error.message}
                    radius='md'
                  />
                )}
              />

              <Controller
                name='displayUrl'
                control={control}
                // rules={{ required: 'Display URL is required' }}
                render={({ field, fieldState }) => (
                  <TextInput
                    label='Display URL'
                    placeholder='Display URL'
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error && fieldState.error.message}
                    radius='md'
                  />
                )}
              />

              <Controller
                name='defaultChannel'
                control={control}
                // rules={{ required: 'Select at least one channel' }}
                render={({ field, fieldState }) => (
                  <Checkbox.Group
                    label='Select default channel'
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error && fieldState.error.message}
                  >
                    <Group mt='xs'>
                      <Checkbox value='react' label='React' />
                      <Checkbox value='svelte' label='Svelte' />
                      <Checkbox value='ng' label='Angular' />
                      <Checkbox value='vue' label='Vue' />
                    </Group>
                  </Checkbox.Group>
                )}
              />
            </div>
            <div className='flex items-center gap-10'>
              <Button variant='default'>Close</Button>
              <Button variant='filled' type='submit' color='dark'>
                Create
              </Button>
            </div>
          </form>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
