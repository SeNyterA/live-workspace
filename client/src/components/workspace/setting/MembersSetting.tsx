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
import { extractApi, TMember, TUser } from '../../../types'
import MemberRole from '../../common/MemberRole'
import UserIcon from '../../common/UserIcon'
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
        <p className='leading-2 truncate text-xs text-gray-500'>
          {user?.email}
        </p>
      </div>
      <Button
        variant='outline'
        color='gray'
        className='h-[30px] min-h-[30px] border-none border-gray-100 bg-gray-400/10 hover:bg-gray-200/10'
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
          <UserIcon user={user} />

          <div className='flex flex-1 flex-col justify-center'>
            <p className='max-w-[150px] truncate font-medium leading-4'>
              {user?.userName}
            </p>
            <p className='leading-2 truncate text-xs text-gray-500'>
              {user?.email}
            </p>
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
    onSucess({ users }) {
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
      className='absolute inset-0 right-[-12px] pr-3'
      scrollbarSize={8}
    >
      <TextInput
        label='Search'
        description='Atleast 3 characters required'
        placeholder='senytera'
        className='sticky top-0 z-[300] mt-4'
        classNames={{
          input:
            'text-gray-100 bg-gray-400/20 border-gray-100/20 hover:border-blue-500/50 focus:border-blue-500/70'
        }}
        leftSection={<IconSearch size={16} />}
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
        rightSection={isLoading && <Loader size={12} />}
      />

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
        <Badge variant='light' color='gray'>
          {members!.length}
        </Badge>
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
