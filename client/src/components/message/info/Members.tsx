import { Avatar, Badge, Indicator, NavLink } from '@mantine/core'
import useAppParams from '../../../hooks/useAppParams'
import { EMemberRole } from '../../../new-types/member.d'
import { useAppSelector } from '../../../redux/store'

export default function Members() {
  const { boardId, channelId, directId, groupId } = useAppParams()
  const targetId = channelId || groupId || directId || boardId || ''

  const members = useAppSelector(state =>
    Object.values(state.workspace.members)
      .filter(member => member.targetId === targetId)
      .map(member => ({
        member,
        user: state.workspace.users[member.userId]
      }))
  )

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

  const enableMembers = members
    ?.filter(({ member, user }) => user?.isAvailable && member?.isAvailable)
    .sort((a, b) => (a.member.role > b.member.role ? -1 : 1))

  const disableMembers = members?.filter(
    ({ member, user }) => !user?.isAvailable || !member?.isAvailable
  )

  return (
    <NavLink
      className='sticky top-0 z-[2] bg-white p-1 pl-0'
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
      classNames={{
        children:
          'pl-0 border-0 border-b border-dashed border-gray-200 pb-2 mb-4'
      }}
    >
      {!!enableMembers?.length &&
        enableMembers?.map(({ member, user }) => (
          <div
            className='mt-2 flex max-w-full flex-1 items-center gap-1 first:mt-0'
            key={user?._id}
          >
            <Indicator
              inline
              size={16}
              offset={3}
              position='bottom-end'
              color='yellow'
              withBorder
              zIndex={1}
            >
              <Avatar src={user?.avatar?.path} size={32} />
            </Indicator>

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
                className='w-16 px-0'
              >
                {member.role}
              </Badge>
            )}
          </div>
        ))}
    </NavLink>
  )
}
