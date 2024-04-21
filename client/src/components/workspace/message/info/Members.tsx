import { Avatar, Badge, Indicator, NavLink } from '@mantine/core'
import useAppParams from '../../../../hooks/useAppParams'
import { useAppSelector } from '../../../../redux/store'
import { EMemberStatus, RoleWeights } from '../../../../types'
import MemberRole from '../../../common/MemberRole'
import UserAvatar from '../../../common/UserAvatar'

export default function Members() {
  const { boardId, channelId, directId, groupId } = useAppParams()
  const targetId = channelId || groupId || directId || boardId || ''

  const members = useAppSelector(state =>
    Object.values(state.workspace.members)
      .filter(member => member.workspaceId === targetId)
      .map(member => ({
        member,
        user: {
          ...state.workspace.users[member.userId]
        }
      }))
  )

  const enableMembers = members?.sort(
    (a, b) => RoleWeights[b.member.role] - RoleWeights[a.member.role]
  )

  return (
    <NavLink
      variant='indicator'
      className='sticky top-0 z-[2] p-1 pl-0 h-8'
      label={
        <Badge
          classNames={{
            root: 'p-0 rounded-none bg-transparent flex-1 flex',
            label: 'flex-1'
          }}
          // rightSection={<span>{members?.length! > 0 && members!.length}</span>}
        >
          Members
        </Badge>
      }
      onClick={() => {}}
      classNames={{
        children: 'pl-0 border-0 border-b border-dashed pb-2 mb-4'
      }}
    >
      {!!enableMembers?.length &&
        enableMembers?.map(({ member, user }) => (
          <div
            className='mt-2 flex max-w-full flex-1 items-center gap-3 shadow-custom first:mt-0'
            key={user?.id}
          >
            <UserAvatar user={user} size={32} />

            <div className='flex flex-1 flex-col justify-center'>
              <p className='max-w-[150px] truncate font-medium leading-4'>
                {user?.userName}
              </p>
              <p className='leading-2 max-w-[150px] truncate text-xs '>
                {user?.email}
              </p>
            </div>

            {member && <MemberRole member={member} />}
          </div>
        ))}
    </NavLink>
  )
}
