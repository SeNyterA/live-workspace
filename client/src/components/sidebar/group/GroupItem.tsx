import { NavLink } from '@mantine/core'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import { TGroup } from '../../../types/workspace.type'

export default function GroupItem({ group }: { group: TGroup }) {
  const { groupId } = useAppParams()
  const { switchTo } = useAppControlParams()
  const groupMembers = useAppSelector(state => {
    const groupMembers = Object.values(state.workspace.members).filter(
      e => e.targetId === group._id
    )

    return {
      groupMembers,
      groupUsers: Object.values(state.workspace.users).filter(user =>
        groupMembers.map(groupMember => groupMember.userId).includes(user._id)
      )
    }
  })

  return (
    <NavLink
      className='p-1 pl-3'
      classNames={{ label: 'truncate max-w-[220px] block flex-1' }}
      label={
        <div className='flex items-center gap-2'>
          <span className='flex-1 truncate'>
            {group.title ||
              groupMembers?.groupUsers.map(e => e.userName).join(', ') ||
              group._id}
          </span>
          <span className='h-4 w-4 rounded-full bg-gray-300 text-center leading-4 text-white'>
            {groupMembers?.groupMembers.length}
          </span>
        </div>
      }
      active={groupId === group._id}
      onClick={() => {
        if (group._id)
          switchTo({
            target: 'group',
            targetId: group._id
          })
      }}
    />
  )
}
