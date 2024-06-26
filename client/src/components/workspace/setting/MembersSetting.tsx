import {
  Avatar,
  Badge,
  Button,
  Divider,
  Loader,
  ScrollArea,
  TextInput
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { getAppValue } from '../../../redux/store'
import Watching from '../../../redux/Watching'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { EWorkspaceType, extractApi, TMember, TUser } from '../../../types'
import MemberRole from '../../common/MemberRole'
import UserAvatar from '../../common/UserAvatar'
import useClassifyMember from './useClassifyMember'

const User = memo(({ user }: { user: TUser }) => {
  const { mutateAsync, isPending } = useAppMutation('addWorkspaceMember')
  const dispatch = useDispatch()
  return (
    <div className='mt-2 flex max-w-full flex-1 items-center gap-3 first:mt-0'>
      <Watching
        watchingFn={state => state.workspace.files[user?.avatarId!]?.path}
      >
        {path => !!path && <Avatar src={path} size={32} />}
      </Watching>

      <div className='flex flex-1 flex-col justify-center pt-1'>
        <p className='max-w-[150px] truncate text-sm font-medium leading-4'>
          {user?.userName}
        </p>
        <p className='leading-2 truncate text-xs '>{user?.email}</p>
      </div>
      <Button
        color='gray'
        className='h-[30px] min-h-[30px] border-none'
        disabled={isPending}
        loading={isPending}
        onClick={() =>
          mutateAsync(
            {
              url: {
                baseUrl: '/workspaces/:workspaceId/members',
                urlParams: {
                  workspaceId: getAppValue(
                    state => state.workspace.workspaceSettingId
                  )!
                }
              },
              method: 'post',
              payload: {
                userId: user.id
              }
            },
            {
              onSuccess(data, variables, context) {
                dispatch(
                  workspaceActions.updateWorkspaceStore(
                    extractApi({
                      members: [data]
                    })
                  )
                )
              }
            }
          )
        }
      >
        Add
        <IconPlus className='ml-2' size={16} />
      </Button>
    </div>
  )
})

const Member = ({ member }: { member: TMember }) => {
  return (
    <Watching watchingFn={state => state.workspace.users[member.userId]}>
      {user => (
        <div className='mt-2 flex max-w-full flex-1 items-center gap-3 first:mt-0'>
          <UserAvatar user={user} />

          <div className='flex flex-1 flex-col justify-center'>
            <p className='max-w-[150px] truncate font-medium leading-4'>
              {user?.userName}
            </p>
            <p className='leading-2 truncate text-xs '>{user?.email}</p>
          </div>

          {member && <MemberRole member={member} />}
        </div>
      )}
    </Watching>
  )
}

export default function MembersSetting() {
  const [searchValue, setSearchValue] = useState('')
  const [validUsers, setValidUsers] = useState<TUser[]>([])
  const { activeMembers, blockedMembers, invitedMembers, members } =
    useClassifyMember({
      searchValue
    })

  const { isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users/by-keyword',
      queryParams: { keyword: searchValue, page: 1, pageSize: 5 }
    },
    options: {
      enabled: searchValue.length > 2
    },
    onSuccess({ users }) {
      const workspace = getAppValue(
        state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
      )

      if (!workspace?.workspaceParentId) {
        const members =
          getAppValue(state =>
            Object.values(state.workspace.members).filter(
              member =>
                member.workspaceId === state.workspace.workspaceSettingId
            )
          ) || []
        const userIds = members.map(member => member.userId)
        const validUser = users.filter(user => !userIds.includes(user.id))
        setValidUsers(validUser)
      }
    }
  })

  return (
    <ScrollArea
      className='absolute inset-0 left-[-12px] right-[-12px]'
      scrollbarSize={8}
      classNames={{ viewport: 'px-3' }}
    >
      <Watching
        watchingFn={state =>
          state.workspace.workspaces[state.workspace.workspaceSettingId!]
            .type === EWorkspaceType.Direct
        }
      >
        {isDirect =>
          isDirect || (
            <TextInput
              label='Search'
              description='Atleast 3 characters required'
              placeholder='senytera'
              className='sticky top-0 z-[300] mt-4'
              leftSection={<IconSearch size={16} />}
              value={searchValue}
              onChange={event => setSearchValue(event.currentTarget.value)}
              rightSection={isLoading && <Loader size={12} />}
            />
          )
        }
      </Watching>

      {validUsers.length > 0 && (
        <>
          <p className='mt-4 font-semibold'>Users</p>
          {validUsers.map(user => (
            <User user={user} key={user.id} />
          ))}
        </>
      )}

      <div className='mt-4 flex justify-between font-semibold'>
        Members
        <Badge color='gray'>{members!.length}</Badge>
      </div>

      {invitedMembers.length > 0 && (
        <>
          {invitedMembers.map(member => (
            <Member
              member={member}
              key={`${member.workspaceId}_${member.userId}`}
            />
          ))}
        </>
      )}

      {activeMembers.length > 0 && (
        <>
          <Divider className='mt-3 border-gray-100/20' variant='dashed' />
          {activeMembers.map(member => (
            <Member
              member={member}
              key={`${member.workspaceId}_${member.userId}`}
            />
          ))}
        </>
      )}

      {blockedMembers.length > 0 && (
        <>
          <Divider className='mt-3' variant='dashed' />
          {blockedMembers.map(member => (
            <Member
              member={member}
              key={`${member.workspaceId}_${member.userId}`}
            />
          ))}
        </>
      )}
    </ScrollArea>
  )
}
