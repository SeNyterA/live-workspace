import { ActionIcon, Indicator, Popover, ScrollArea } from '@mantine/core'
import { IconBell } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { EMemberStatus, extractApi } from '../../types'
import Invition from './Invition'

export default function Notification() {
  const dispatch = useDispatch()
  useAppQuery({
    key: 'getInvitions',
    url: {
      baseUrl: '/members/invitions'
    },
    onSuccess(data) {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({ members: data.invitions })
        )
      )
    }
  })
  const invitions = useAppSelector(state =>
    Object.values(state.workspace.members).filter(
      member =>
        member.status === EMemberStatus.Invited &&
        member.userId === state.auth.userInfo?.id
    )
  )

  return (
    <Popover width={300} position='bottom-end' withArrow shadow='md'>
      <Popover.Target>
        <Indicator
          className='flex items-center'
          offset={5}
          disabled={!invitions?.length}
          processing
        >
          <ActionIcon variant='transparent'>
            <IconBell size={24} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown className='inset-0 h-80'>
        <ScrollArea
          scrollbarSize={8}
          className='absolute inset-0 bg-transparent p-3'
        >
          {invitions?.map(invition => (
            <Invition invition={invition} key={invition.workspaceId} />
          ))}
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  )
}
