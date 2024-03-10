import {
  Avatar,
  Badge,
  Button,
  Divider,
  Indicator,
  Loader,
  ScrollArea,
  Select,
  TextInput
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { getAppValue } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import {
  EMemberRole,
  EMemberStatus,
  RoleWeights,
  TMember,
  TUser
} from '../../../types'
import { hasPermissionToOperate, parseMember } from '../../../utils/helper'
import MemberRole from '../../common/MemberRole'
import useClassifyMember from './useClassifyMember'

const User = memo(({ user }: { user: TUser }) => {
  const { mutateAsync, isPending } = useAppMutation('addWorkspaceMember')
  return (
    <div className='mt-2 flex max-w-full flex-1 items-center gap-3 first:mt-0'>
      <Avatar src={user?.avatar?.path} size={32} />

      <div className='flex flex-1 flex-col justify-center pt-1'>
        <p className='max-w-[150px] truncate text-sm font-medium leading-4'>
          {user?.userName}
        </p>
        <p className='leading-2 max-w-[150px] truncate text-xs text-gray-500'>
          {user?.email}
        </p>
      </div>
      <Button
        variant='outline'
        color='gray'
        className='h-[30px] min-h-[30px] border-none border-gray-100 bg-gray-100'
        disabled={isPending}
        loading={isPending}
        onClick={() =>
          mutateAsync({
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
              member: {
                userId: user.id,
                role: EMemberRole.Member
              } as any
            }
          })
        }
      >
        Add
        <IconPlus className='ml-2' size={16} />
      </Button>
    </div>
  )
})

const Member = memo(({ member }: { member: TMember }) => {
  const dispatch = useDispatch()
  const { mutateAsync: editWorkspaceMember, isPending } = useAppMutation(
    'editWorkspaceMember',
    {
      mutationOptions: {
        onSuccess(data, variables, context) {
          const { member, user } = parseMember(data.member)
          dispatch(
            workspaceActions.updateWorkspaceStore({
              members: { [member.id]: member },
              users: { [user!.id]: user! }
            })
          )
        }
      }
    }
  )

  const { enabled, operatorWeight } = hasPermissionToOperate({
    operatorRole:
      getAppValue(
        state =>
          Object.values(state.workspace.members).find(
            e =>
              e.userId === state.auth.userInfo?.id &&
              e.targetId === state.workspace.workspaceSettingId
          )?.role
      ) || EMemberRole.Member,
    targetRole: member.role
  })
  return (
    <>
      <div className='mt-2 flex max-w-full flex-1 items-center gap-3 first:mt-0'>
        <Indicator
          inline
          size={16}
          offset={3}
          position='bottom-end'
          color='yellow'
          withBorder
          zIndex={1}
        >
          <Avatar src={member?.user?.avatar?.path} size={32} />
        </Indicator>

        <div className='flex flex-1 flex-col justify-center pt-1'>
          <p className='max-w-[150px] truncate text-sm font-medium leading-4'>
            {member?.user?.userName}
          </p>
          <p className='leading-2 max-w-[150px] truncate text-xs text-gray-500'>
            {member?.user?.email}
          </p>
        </div>

        {member.status === EMemberStatus.Invited ? (
          <div className='flex h-[30px] min-h-[30px] items-center justify-center rounded border-none border-gray-100 bg-gray-100 px-4'>
            Invited
          </div>
        ) : (
          <Select
            disabled={!enabled || isPending}
            rightSection={isPending && <Loader size={12} />}
            classNames={{
              input:
                'border-gray-100 border-none bg-gray-100 min-h-[30px] h-[30px]',
              dropdown: 'pr-2'
            }}
            className='w-28'
            data={[
              {
                group: 'Role',
                items: [
                  { label: EMemberRole.Member, value: EMemberRole.Member },
                  {
                    label: EMemberRole.Admin,
                    value: EMemberRole.Admin,
                    disabled:
                      (operatorWeight || 0) < RoleWeights[EMemberRole.Admin]
                  },
                  {
                    label: EMemberRole.Owner,
                    value: EMemberRole.Owner,
                    disabled:
                      (operatorWeight || 0) < RoleWeights[EMemberRole.Owner]
                  }
                ]
              },
              {
                group: 'Remove',
                items: [{ label: 'Kick', value: 'Kick' }]
              }
            ]}
            value={member.role}
            onChange={role => {
              editWorkspaceMember({
                url: {
                  baseUrl: '/workspaces/:workspaceId/members/:memberId',
                  urlParams: {
                    workspaceId: member.targetId,
                    memberId: member.id
                  }
                },
                method: 'patch',
                payload: {
                  member: {
                    role: role
                  } as any
                }
              })
            }}
          />
        )}
      </div>
    </>
  )
})

const Member_ = ({ member }: { member: TMember }) => {
  return (
    <div
      className='mt-2 flex max-w-full flex-1 items-center gap-3 first:mt-0'
      key={member?.user?.id}
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
        <Avatar src={member?.user?.avatar?.path} size={32} />
      </Indicator>

      <div className='flex flex-1 flex-col justify-center'>
        <p className='max-w-[150px] truncate font-medium leading-4'>
          {member?.user?.userName}
        </p>
        <p className='leading-2 max-w-[150px] truncate text-xs text-gray-500'>
          {member?.user?.email}
        </p>
      </div>

      {member && <MemberRole member={member} />}
    </div>
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
              member => member.targetId === state.workspace.workspaceSettingId
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
        description='Search by name, username, email. Atleast 3 characters required'
        placeholder='senytera'
        className='sticky top-0 z-[300] mt-4 bg-white'
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
            <Member_ member={member} key={member.id} />
          ))}
        </>
      )}

      {activeMembers.length > 0 && (
        <>
          <Divider className='mt-3' variant='dashed' />
          {activeMembers.map(member => (
            <Member_ member={member} key={member.id} />
          ))}
        </>
      )}

      {blockedMembers.length > 0 && (
        <>
          <Divider className='mt-3' variant='dashed' />
          {blockedMembers.map(member => (
            <Member_ member={member} key={member.id} />
          ))}
        </>
      )}
    </ScrollArea>
  )
}
