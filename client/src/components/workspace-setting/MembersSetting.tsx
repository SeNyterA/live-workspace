import {
  Avatar,
  Button,
  Indicator,
  Loader,
  ScrollArea,
  Select,
  TextInput
} from '@mantine/core'
import { IconSearch, IconSend } from '@tabler/icons-react'
import { memo, useState } from 'react'
import { EMemberRole, TMember } from '../../new-types/member.d'
import { TUser } from '../../new-types/user.d'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'

const User = memo(({ user }: { user: TUser }) => {
  return (
    <div className='mt-2 flex max-w-full flex-1 items-center gap-2 first:mt-0'>
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
        size='xs'
        variant='outline'
        color='gray'
        className='h-[30px] min-h-[30px] border-none border-gray-100 bg-gray-100'
      >
        Invite
        <IconSend className='ml-2' size={16} />
      </Button>
    </div>
  )
})

const Member = memo(({ member, user }: { member: TMember; user: TUser }) => {
  return (
    <>
      <div className='mt-2 flex max-w-full flex-1 items-center gap-2 first:mt-0'>
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
          classNames={{
            input:
              'border-gray-100 border-none bg-gray-100 min-h-[30px] h-[30px]',
            dropdown: 'pr-2'
          }}
          className='w-28'
          data={Object.values(EMemberRole)}
          value={member.role}
          onChange={() => {}}
        />
      </div>
    </>
  )
})

export default function MembersSetting() {
  const [searchValue, setSearchValue] = useState('')
  const members = useAppSelector(state =>
    Object.values(state.workspace.members)
      .filter(member => member.targetId === state.workspace.workspaceSettingId)
      .map(member => ({
        member,
        user: state.workspace.users[member.userId]
      }))
      .filter(
        ({ member, user }) =>
          user.userName.includes(searchValue) ||
          user.email.includes(searchValue) ||
          user.nickName?.includes(searchValue)
      )
  )

  const { data, isPending, isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users/by-keyword',
      queryParams: { keyword: searchValue, page: 1, pageSize: 5 }
    },
    options: {
      enabled: searchValue.length > 2
    }
  })

  return (
    <ScrollArea
      className='absolute inset-0 right-[-12px] pr-3'
      scrollbarSize={8}
    >
      <TextInput
        label='Search'
        description='Search by name, username, email...'
        placeholder='senytera'
        className='sticky top-0 z-[300] mt-4 bg-white'
        leftSection={<IconSearch size={16} />}
        value={searchValue}
        onChange={event => setSearchValue(event.currentTarget.value)}
        rightSection={isLoading && <Loader size={12} />}
      />

      {!!data?.users?.length && (
        <>
          <p className='mt-4 font-semibold'>Users</p>
          {data?.users.map((user: TUser) => (
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
