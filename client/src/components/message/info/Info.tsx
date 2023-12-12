import { ActionIcon, Divider, ScrollArea } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { useMessageInfo } from './InfoProvier'
import Members from './Members'

export default function Info() {
  const {
    title,
    targetId: { channelId, directId, groupId, boardId }
  } = useMessageInfo()

  return (
    <div className='flex w-80 flex-col py-3'>
      <div className='flex justify-between px-4'>
        <div>
          <p className='text-base'>{title}</p>
          <p className='text-xs text-gray-500'>
            id: {channelId || directId || groupId || boardId}
          </p>
        </div>
        <ActionIcon size={30} variant='light' color='gray'>
          <IconSettings size={16} />
        </ActionIcon>
      </div>
      <Divider variant='dashed' className='mx-4 my-2' />
      <div className='relative flex-1 px-4'>
        <ScrollArea className='absolute inset-0 px-4' scrollbarSize={8}>
          <Members />
        </ScrollArea>
      </div>
    </div>
  )
}
