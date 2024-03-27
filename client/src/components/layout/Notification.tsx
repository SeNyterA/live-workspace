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

  return (
    <Popover
      width={300}
      position='bottom-end'
      withArrow
      shadow='md'
      classNames={{
        dropdown: '!bg-black/95 border-gray-800',
        arrow: 'bg-black/95 border-gray-800'
      }}
    >
      <Popover.Target>
        <ActionIcon className='bg-transparent text-gray-500 hover:bg-gray-400/20'>
          <IconBell size={24} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown className='inset-0 h-80'>
        {/* {invitions?.invitions.map(invition => (
          <Invition invition={invition} key={invition.id} />
        ))} */}
        <ScrollArea
          scrollbarSize={8}
          className='absolute inset-0 bg-transparent p-3'
        >
          {invitions?.invitions.map(invition => (
            <Invition invition={invition} key={invition.workspaceId} />
          ))}
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  )
}
