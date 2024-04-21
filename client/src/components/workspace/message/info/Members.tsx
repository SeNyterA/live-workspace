import { Avatar, Badge, Indicator, NavLink } from '@mantine/core'
import { IconHash } from '@tabler/icons-react'
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
      defaultOpened={true}
      data-info
      leftSection={<IconHash className='scale-90' size={20} />}
      className='sticky top-0 z-[2] h-8 p-1 pl-0'
      classNames={{
        children: 'pl-0 mb-2 mt-1',
        section: 'data-[position="left"]:me-[8px]'
      }}
      label={
        <Badge
          rightSection={<span>{members?.length! > 0 && members!.length}</span>}
          classNames={{
            root: 'p-0 rounded-none bg-transparent flex-1 flex',
            label: 'flex-1',
            section: 'data-[position="left"]:me-[8px]'
          }}
        >
          Members
        </Badge>
      }
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
