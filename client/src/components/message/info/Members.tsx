import { Avatar, Badge, Indicator, NavLink } from '@mantine/core'
import { useAppSelector } from '../../../redux/store'
import { EMemberRole } from '../../../types/workspace.type'
import UserDetailProvider from '../../user/UserDetailProvider'
import { useMessageInfo } from './InfoProvier'

export default function Members() {
  const {
    type,
    targetId: { channelId, directId, boardId, groupId }
  } = useMessageInfo()

  const members = useAppSelector(state => {
    const _members = Object.values(state.workspace.members)
    const _users = Object.values(state.workspace.users)
    switch (type) {
      case 'channel':
      case 'board':
      case 'group':
        return _members
          .filter(members =>
            [channelId, boardId, groupId].includes(members.targetId)
          )
          .map(members => ({
            member: members,
            user: _users.find(user => user._id === members.userId)
          }))

      case 'direct':
        return _users
          .filter(user =>
            (
              Object.values(state.workspace.directs).find(
                direct => direct._id === directId
              )?.userIds || []
            ).includes(user._id)
          )
          .map(user => ({ user, member: undefined }))
      default:
        return []
    }
  })

  const getRoleColor = (role: EMemberRole) => {
    switch (role) {
      case EMemberRole.Owner:
        return 'green'
      case EMemberRole.Admin:
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <NavLink
      className='p-1 pl-0'
      label={
        <div className='flex items-center justify-between'>
          Members
          {members?.length && (
            <Badge variant='light' color='gray'>
              {members.length}
            </Badge>
          )}
        </div>
      }
      onClick={() => {}}
      classNames={{ children: 'pl-0' }}
    >
      {members?.map(({ member, user }) => (
        <div className='mt-2 flex flex-1 items-center gap-2' key={user?._id}>
          <UserDetailProvider>
            <Indicator
              inline
              size={16}
              offset={3}
              position='bottom-end'
              color='yellow'
              withBorder
            >
              <Avatar src={user?.avatar} size={36} />
            </Indicator>
          </UserDetailProvider>

          <div className='flex flex-1 flex-col justify-center'>
            <p className='max-w-[150px] truncate font-medium leading-4'>
              {user?.userName}
            </p>
            <p className='leading-2 max-w-[150px] truncate text-xs text-gray-500'>
              {user?.email}
            </p>
          </div>

          {member && (
            <Badge
              variant='light'
              color={getRoleColor(member.role)}
              radius='xs'
              className='w-20'
            >
              {member.role}
            </Badge>
          )}
        </div>
      ))}
    </NavLink>
  )
}
