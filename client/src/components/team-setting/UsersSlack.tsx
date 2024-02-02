import {
  ActionIcon,
  Avatar,
  Divider,
  Indicator,
  Input,
  Menu,
  rem,
  ScrollArea,
  Select,
  Table
} from '@mantine/core'
import {
  IconDots,
  IconMessages,
  IconSearch,
  IconTrash
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import { EMemberRole } from '../../types/workspace.type'

export function UsersStack() {
  const { teamId } = useAppParams()

  const members =
    useAppSelector(state =>
      Object.values(state.workspace.members)
        .filter(e => e.targetId === teamId)
        .map(member => ({ member, user: state.workspace.users[member.userId] }))
    ) || []

  const rows = useMemo(() => {
    return members.map(({ user, member }) => (
      <Table.Tr key={member._id}>
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
              <Avatar src={user?.avatar} size={36} />
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
          <Select
            data={[EMemberRole.Owner, EMemberRole.Admin, EMemberRole.Member]}
            value={member.role}
            variant='unstyled'
            allowDeselect={false}
          />
        </Table.Td>
        <Table.Td>{dayjs(member.createdAt).format('DD/MM/YYYY')}</Table.Td>
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
                  <IconMessages
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Send message
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconTrash
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
                color='red'
              >
                Remove
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    ))
  }, [members])

  return (
    <div className='flex flex-1'>
      <div className='relative flex-[3]'>
        <ScrollArea className='absolute inset-0 inset-x-3'>
          <Table
            stickyHeader
            stickyHeaderOffset={0}
            striped
            withRowBorders={false}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Employee</Table.Th>
                <Table.Th className='w-32'>Role</Table.Th>
                <Table.Th className='w-32'>Joined At</Table.Th>
                <Table.Th className='w-11'></Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </div>

      <Divider variant='dashed' orientation='vertical' />

      <div className='flex flex-[2] flex-col p-3 items-end'>
        <Input
          className='flex h-[30px] w-48 items-center rounded bg-gray-100'
          size='sm'
          placeholder='Search user'
          leftSection={<IconSearch size={14} />}
          classNames={{
            input: 'bg-transparent border-none min-h-[20px] h-[20px]'
          }}
        />
        <div className='relative flex-1'>
          <ScrollArea className='absolute inset-0'></ScrollArea>
        </div>
      </div>
    </div>
  )
}
