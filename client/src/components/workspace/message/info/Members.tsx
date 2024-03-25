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
      className='sticky top-0 z-[2] p-1 pl-0 hover:bg-blue-400/20'
      label={
        <div className='flex items-center justify-between'>
          Members
          {members?.length! > 0 && (
            <Badge variant='light' color='gray'>
              {members!.length}
            </Badge>
          )}
        </div>
      }
      onClick={() => {}}
      classNames={{
        children:
          'pl-0 border-0 border-b border-dashed border-gray-200/20 pb-2 mb-4'
      }}
    >
      {!!enableMembers?.length &&
        enableMembers?.map(({ member, user }) => (
          <div
            className='mt-2 flex max-w-full flex-1 items-center gap-3 shadow-custom first:mt-0'
            key={user?.id}
          >
            {/* <Indicator
              inline
              size={12}
              offset={4}
              position='bottom-end'
              color='yellow'
              processing
              zIndex={1}
            >
              <Avatar src={user?.avatar?.path} size={32} />
            </Indicator> */}

            <UserAvatar user={user} size={32} />

            <div className='flex flex-1 flex-col justify-center'>
              <p className='max-w-[150px] truncate font-medium leading-4'>
                {user?.userName}
              </p>
              <p className='leading-2 max-w-[150px] truncate text-xs text-gray-300'>
                {user?.email}
              </p>
            </div>

            {member && <MemberRole member={member} />}
          </div>
        ))}
    </NavLink>
  )
}
