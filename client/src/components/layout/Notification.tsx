import { ActionIcon, Popover, ScrollArea } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'
import { useAppQuery } from '../../services/apis/useAppQuery'
import Invition from './Invition'

export default function Notification() {
  const { data: invitions } = useAppQuery({
    key: 'getInvitions',
    url: {
      baseUrl: '/members/invitions'
    }
  })

  console.log(invitions?.invitions)

  return (
    <Popover width={300} position='bottom-end' withArrow shadow='md'>
      <Popover.Target>
        <ActionIcon className='bg-transparent text-gray-500'>
          <IconBell size={24} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown className='h-80 inset-0'>
        {/* {invitions?.invitions.map(invition => (
          <Invition invition={invition} key={invition._id} />
        ))} */}
        <ScrollArea scrollbarSize={8} className='absolute inset-0 p-3'>
          {invitions?.invitions.map(invition => (
            <Invition invition={invition} key={invition.id} />
          ))}
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  )
}
