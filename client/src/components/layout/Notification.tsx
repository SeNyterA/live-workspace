import { ActionIcon, Indicator, Popover, ScrollArea } from '@mantine/core'
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
    <Popover width={300} position='bottom-end' withArrow shadow='md'>
      <Popover.Target>
        <Indicator
          className='flex items-center'
          offset={5}
          label={!!invitions?.invitions.length}
          processing
        >
          <ActionIcon variant='transparent'>
            <IconBell size={24} />
          </ActionIcon>
        </Indicator>
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
