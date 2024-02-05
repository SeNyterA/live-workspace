import { ActionIcon, ScrollArea } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { useState } from 'react'
import TeamSetting from '../../team-setting/TeamSetting'
import { useMessageInfo } from './InfoProvier'
import Members from './Members'
import PinedMesages from './PinedMesages'

export default function Info() {
  const {
    title,
    targetId: { channelId, directId, groupId, boardId }
  } = useMessageInfo()

  const [openSeting, setOpenSetting] = useState(false)

  return (
    <>
      <div className='flex w-80 flex-col py-3'>
        <div className='flex justify-between px-4'>
          <div>
            <p className='text-base'>{title}</p>
            <p className='text-xs text-gray-500'>
              id: {channelId || directId || groupId || boardId}
            </p>
          </div>
          <ActionIcon
            size={30}
            variant='light'
            color='gray'
            onClick={() => setOpenSetting(true)}
          >
            <IconSettings size={16} />
          </ActionIcon>
        </div>
        {/* <Divider variant='dashed' className='mx-4 my-2' /> */}
        <div className='relative mt-2 flex-1 px-4'>
          <ScrollArea
            className='absolute inset-0 space-y-6 px-4'
            scrollbarSize={8}
          >
            <Members />
            <PinedMesages />
          </ScrollArea>
        </div>
      </div>

      <TeamSetting isOpen={openSeting} onClose={() => setOpenSetting(false)} />
    </>
  )
}
