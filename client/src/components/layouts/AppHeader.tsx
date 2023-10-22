import { Avatar, Input } from '@mantine/core'

export default function AppHeader() {
  return (
    <div className='h-12 flex gap-3 items-center px-3'>
      <p className='text-xl font-semibold'>Live workspace - Senytera</p>
      <div className='flex-1 items-center justify-center flex'>
        <Input className='w-96'/>
      </div>
      <div>
        <Avatar />
      </div>
    </div>
  )
}
