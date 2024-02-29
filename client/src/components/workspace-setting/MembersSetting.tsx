import {
  Avatar,
  Button,
  Indicator,
  Loader,
  ScrollArea,
  Select,
  TextInput
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { memo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { getAppValue, useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'
import { useAppQuery } from '../../services/apis/useAppQuery'
import {
  EMemberRole,
  RoleWeights,
  TMember,
  TUser,
  WorkspaceType
} from '../../types'
import { hasPermissionToOperate, parseMember } from '../../utils/helper'

const User = memo(({ user }: { user: TUser }) => {
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
      >
        Add
        <IconPlus className='ml-2' size={16} />
      </Button>
    </div>
  )
})

const Member = memo(({ member, user }: { member: TMember; user: TUser }) => {
  const dispatch = useDispatch()
  const { mutateAsync: editWorkspaceMember, isPending } = useAppMutation(
    'editWorkspaceMember',
    {
      mutationOptions: {
        onSuccess(data, variables, context) {
          const { member, user } = parseMember(data.member)
          dispatch(
            workspaceActions.updateWorkspaceStore({
              members: { [member._id]: member },
              users: { [user!._id]: user! }
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
              e.userId === state.auth.userInfo?._id &&
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
          <Avatar src={user?.avatar?.path} size={32} />
        </Indicator>

        <div className='flex flex-1 flex-col justify-center pt-1'>
          <p className='max-w-[150px] truncate text-sm font-medium leading-4'>
            {user?.userName}
          </p>
          <p className='leading-2 max-w-[150px] truncate text-xs text-gray-500'>
            {user?.email}
          </p>
        </div>

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
            { label: EMemberRole.Member, value: EMemberRole.Member },
            {
              label: EMemberRole.Admin,
              value: EMemberRole.Admin,
              disabled: (operatorWeight || 0) < RoleWeights[EMemberRole.Admin]
            },
            {
              label: EMemberRole.Owner,
              value: EMemberRole.Owner,
              disabled: (operatorWeight || 0) < RoleWeights[EMemberRole.Owner]
            }
          ]}
          value={member.role}
          onChange={role => {
            editWorkspaceMember({
              url: {
                baseUrl: '/workspaces/:workspaceId/members/:memberId',
                urlParams: {
                  workspaceId: member.targetId,
                  memberId: member._id
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
      </div>
    </>
  )
})

export default function MembersSetting({
  wokrspaceType
}: {
  wokrspaceType?: WorkspaceType
}) {
  const [searchValue, setSearchValue] = useState('')
  const [validUsers, setValidUsers] = useState<TUser[]>([])
  const members = useAppSelector(state =>
    Object.values(state.workspace.members)
      .filter(member => member.targetId === state.workspace.workspaceSettingId)
      .map(member => ({
        member,
        user: state.workspace.users[member.userId]
      }))
      .filter(
        ({ user }) =>
          user.userName.includes(searchValue) ||
          user.email.includes(searchValue) ||
          user.nickName?.includes(searchValue)
      )
  )

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

      if (!workspace?.parentId) {
        const members =
          getAppValue(state =>
            Object.values(state.workspace.members).filter(
              member => member.targetId === state.workspace.workspaceSettingId
            )
          ) || []
        const userIds = members.map(member => member.userId)
        const validUser = users.filter(user => !userIds.includes(user._id))
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
            <User user={user} key={user._id} />
          ))}
        </>
      )}

      <p className='mt-4 font-semibold'>Channel members</p>
      {!!members?.length &&
        members?.map(({ member, user }) => (
          <Member member={member} user={user} key={member._id} />
        ))}
    </ScrollArea>
  )
}
