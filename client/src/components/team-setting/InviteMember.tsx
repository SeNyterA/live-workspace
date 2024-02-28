import {
  ActionIcon,
  Avatar,
  Indicator,
  Input,
  Menu,
  rem,
  ScrollArea,
  Table
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import {
  IconDots,
  IconMessage,
  IconPlus,
  IconSearch
} from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppQuery } from '../../services/apis/useAppQuery'

export function InviteMember() {
  const dispatch = useDispatch()
  const [searchValue, setSearchValue] = useState('')
  const [keyword] = useDebouncedValue(searchValue, 200)

  const { data: userData, isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users/by-keyword',
      queryParams: {
        keyword
      }
    },
    options: {
      queryKey: [keyword],
      enabled: !!keyword
    }
  })

  useEffect(() => {
    if (userData)
      dispatch(
        workspaceActions.updateData({
          users: userData.users.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          )
        })
      )
  }, [userData])

  const rows = useMemo(() => {
    return userData?.users.map(user => (
      <Table.Tr key={user._id}>
        <Table.Td>
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
          </div>
        </Table.Td>

        <Table.Td>
          <Menu
            transitionProps={{ transition: 'pop' }}
            withArrow
            position='bottom-end'
            withinPortal
          >
            <Menu.Target>
              <ActionIcon variant='subtle' color='gray'>
                <IconDots
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconPlus
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Invite
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconMessage
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Send message
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    ))
  }, [userData])

  return (
    <div className='flex w-[300px] flex-col'>
      <div className='flex h-12 w-full items-center justify-end gap-2'>
        <Input
          value={searchValue}
          onChange={e => setSearchValue(e.currentTarget.value)}
          className='flex h-[30px] items-center rounded bg-gray-100'
          size='sm'
          placeholder='orther members'
          leftSection={<IconSearch size={14} />}
          classNames={{
            input: 'bg-transparent border-none min-h-[20px] h-[20px]'
          }}
        />

        {/* <ActionIcon variant='light' className='h-[30px] w-[30px] bg-gray-100'>
          <IconX className={`h-4 w-4 transition-transform`} />
        </ActionIcon> */}
      </div>
      {/* <Divider variant='dashed' /> */}

      <div className='relative flex-1'>
        <ScrollArea className='absolute inset-0'>
          <Table
            stickyHeader
            stickyHeaderOffset={0}
            striped
            withRowBorders={false}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>User</Table.Th>
                <Table.Th className='w-11'></Table.Th>
              </Table.Tr>
            </Table.Thead>

            {!!rows && <Table.Tbody>{rows}</Table.Tbody>}
          </Table>

          {!!rows || (
            <div className='flex h-40 items-center justify-center rounded-md bg-gray-50 text-gray-600'>
              {isLoading ? 'Loading...' : 'No data'}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
