import { ActionIcon, Avatar, Divider, ScrollArea, Select } from '@mantine/core'
import { IconAddressBook, IconSettings } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { EMemberRole, TMember } from '../../types/workspace.type'
import AddTeamMember from './AddTeamMember'

const UserMember = ({ member }: { member: TMember }) => {
  const user = useAppSelector(state => state.workspace.users[member.userId])
  const me = useAppSelector(state => state.auth.userInfo)
  const dispatch = useDispatch()

  const { mutateAsync, isPending } = useAppMutation('editTeamMemberRole')
  if (!user) return <></>

  return (
    <div className='my-2 flex items-center gap-3 first:my-0'>
      <div className='flex flex-1 gap-2'>
        <Avatar src={user.avatar} />
        <div className='flex flex-col justify-center'>
          <p className='font-medium leading-5'>{user.userName}</p>
          <p className='text-xs leading-3 text-gray-500'>
            {me?._id === user._id ? 'me' : user.email}
          </p>
        </div>
      </div>

      <Select
        onChange={async value => {
          mutateAsync({
            method: 'patch',
            url: {
              baseUrl: '/workspace/teams/:teamId/members/:memberId',
              urlParams: {
                memberId: member._id,
                teamId: member.targetId
              }
            },
            payload: {
              role: value as EMemberRole
            }
          }).then(data => {
            if (data.success) {
              dispatch(
                workspaceActions.addMembers({
                  members: {
                    [data.data._id]: data.data
                  }
                })
              )
            }
          })
        }}
        placeholder='Pick value'
        classNames={{ input: 'border-none' }}
        data={[
          {
            value: EMemberRole.Member,
            label: EMemberRole.Member,
            disabled: member.role === EMemberRole.Member
          },
          {
            value: EMemberRole.Admin,
            label: EMemberRole.Admin,
            disabled: member.role === EMemberRole.Admin
          },
          {
            value: EMemberRole.Owner,
            label: EMemberRole.Owner,
            disabled: member.role === EMemberRole.Owner
          }
        ]}
        size='sm'
        value={member.role}
        // rightSection={isPending ? <Loader size={'xs'} /> : undefined}
        readOnly={isPending}
      />

      <ActionIcon variant='light' color='red'>
        <IconSettings />
      </ActionIcon>
    </div>
  )
}

export default function MemberSetting() {
  const { teamId } = useAppParams()
  const members = useAppSelector(e =>
    Object.values(e.workspace.members).filter(
      member => member.targetId === teamId
    )
  )

  return (
    <>
      <div className='flex flex-1 flex-col gap-3'>
        <div>
          <ActionIcon>
            <IconAddressBook />
          </ActionIcon>
        </div>
        <Divider variant='dashed' />
        <div className='relative flex-1'>
          <ScrollArea scrollbarSize={6} className='absolute inset-0'>
            {members?.map(member => (
              <UserMember member={member} key={member._id} />
            ))}
          </ScrollArea>
        </div>
      </div>

      <AddTeamMember />
    </>
  )
}
