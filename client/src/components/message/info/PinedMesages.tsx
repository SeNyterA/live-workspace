import { NavLink } from '@mantine/core'
import { useMessageInfo } from './InfoProvier'

export default function PinedMesages() {
  const {
    type,
    targetId: { channelId, directId, boardId, groupId }
  } = useMessageInfo()

  return (
    <NavLink
      className='p-1 pl-0 mt-1'
      label={
        <div className='flex items-center justify-between'>
          Pined messages
          {/* {members?.length && (
            <Badge variant='light' color='gray'>
              {members.length}
            </Badge>
          )} */}
        </div>
      }
      onClick={() => {}}
      classNames={{ children: 'pl-0' }}
    >
      {/* {members?.map(({ member, user }) => (
        <div className='mt-2 flex flex-1 items-center gap-2' key={user?._id}>
          <UserDetailProvider user={user}>
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
      ))} */}
    </NavLink>
  )
}
