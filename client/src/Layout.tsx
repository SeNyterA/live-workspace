import { Avatar, Divider, ScrollArea } from '@mantine/core'
import { ReactNode } from 'react'
import TeamSidebar from './components/TeamSidebar'
import AppHeader from './components/layouts/AppHeader'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='w-screen h-screen flex flex-col text-sm'>
      <AppHeader />
      <Divider variant='dashed' />
      <div className='flex-1 flex'>
        <div className='h-full flex-col flex py-2 gap-2 justify-center w-[54px]'>
          <Avatar className='mx-2' />
          <Divider variant='dashed' className='mx-4' />
          <div className='flex-1 relative'>
            <ScrollArea className='absolute inset-0 px-2' scrollbarSize={6}>
              {Array(1000)
                .fill(1)
                .map((_, index) => (
                  <Avatar className='mt-1 first:mt-0' key={index} />
                ))}
            </ScrollArea>
          </div>
        </div>

        <Divider variant='dashed' orientation='vertical' />
        <div className='flex-1 flex'>
          <TeamSidebar />
          <Divider variant='dashed' orientation='vertical' />
          {children}
        </div>
      </div>
    </div>
  )
}
