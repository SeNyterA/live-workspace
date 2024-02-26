import { Avatar, Badge, Indicator, NavLink, ScrollArea } from '@mantine/core'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import { EMemberRole } from '../../../types/workspace.type'

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
    .sort((a, b) => (a.member.role > b.member.role ? 1 : -1))

  const disableMembers = members?.filter(
    ({ member, user }) => !user?.isAvailable || !member?.isAvailable
  )

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
      classNames={{
        children:
          'h-[300px] relative w-full border rounded border-dashed bg-gray-50 border-none'
      }}
    >
      <ScrollArea className='absolute inset-2 right-0 pr-2' scrollbarSize={8} >
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
              >
                <Avatar src={user?.avatar?.path} size={36} />
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
        {!!disableMembers?.length && (
          <>
            {/* <Divider variant='dashed' className='mt-2' /> */}
            {disableMembers.map(({ member, user }) => (
              <div
                className='mt-2 flex flex-1 items-center gap-2 first:mt-0'
                key={user?._id}
              >
                <Indicator
                  inline
                  size={16}
                  offset={3}
                  position='bottom-end'
                  color='yellow'
                  withBorder
                >
                  <Avatar src={user?.avatar?.path} size={36} />
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
                    color={'dark'}
                    radius='xs'
                    className='w-20'
                  >
                    None
                  </Badge>
                )}
              </div>
            ))}
          </>
        )}
      </ScrollArea>
    </NavLink>
  )
}
