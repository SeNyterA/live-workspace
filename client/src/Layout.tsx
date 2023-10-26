import { Avatar, Divider, ScrollArea } from '@mantine/core'
import { ReactNode } from 'react'
import AppHeader from './components/layouts/AppHeader'
import Sidebar from './components/layouts/Sidebar'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='flex h-screen w-screen flex-col text-sm'>
      <AppHeader />
      <Divider variant='dashed' />
      <div className='flex flex-1'>
        <div className='flex h-full w-[54px] flex-col justify-center gap-2 py-2'>
          <Avatar className='mx-2' />
          <Divider variant='dashed' className='mx-4' />
          <div className='relative flex-1'>
            <ScrollArea className='absolute inset-0 px-2' scrollbarSize={6}>
              {Array(10)
                .fill(1)
                .map((_, index) => (
                  <Avatar className='mt-1 first:mt-0' key={index} />
                ))}
            </ScrollArea>
          </div>
          <Divider variant='dashed' className='mx-4' />
          <Avatar
            className='mx-2'
            onClick={() => {
              console.log('sssssssssss')
            }}
          />
        </div>

        <Divider variant='dashed' orientation='vertical' />
        <div className='flex flex-1'>
          <Sidebar />
          <Divider variant='dashed' orientation='vertical' />
          {children}
        </div>
      </div>
    </div>
  )
}
