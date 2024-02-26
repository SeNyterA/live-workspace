import {
  ActionIcon,
  Avatar,
  CloseButton,
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
import { useMemo, useState } from 'react'
import { useAppSelector } from '../../redux/store'
import { useSetting } from './TeamSetting'
import { EMemberRole } from '../../new-types/member.d'

const getEditableRoles = (
  operatorRole?: EMemberRole,
  targetRole?: EMemberRole
): EMemberRole[] => {
  if (operatorRole === EMemberRole.Owner) {
    return [EMemberRole.Owner, EMemberRole.Admin, EMemberRole.Member]
  }

  if (operatorRole === EMemberRole.Admin) {
    if (targetRole === EMemberRole.Owner) return []
    return [EMemberRole.Admin, EMemberRole.Member]
  }

  return []
}

export function UsersStack() {
  const { targetId, operatorMember, setUserSelected } = useSetting()

  const [search, setSearch] = useState('')

  const members =
    useAppSelector(
      state =>
        Object.values(state.workspace.members)
          .filter(e => e.targetId === targetId)
          .map(member => ({
            member,
            user: state.workspace.users[member.userId]
          }))
          .filter(
            ({ user }) =>
              user?.userName.toLowerCase().includes(search.toLowerCase()) ||
              user?.email.toLowerCase().includes(search.toLowerCase()) ||
              user?.nickname?.toLowerCase().includes(search.toLowerCase())
          ) || []
    ) || []

    console.log(members)

  const rows = useMemo(() => {
    return members.map(({ user, member }) => (
      <Table.Tr key={member._id} onClick={() => setUserSelected(user._id)}>
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
          {getEditableRoles(operatorMember?.role, member.role).length !== 0 ? (
            <Select
              data={getEditableRoles(operatorMember?.role, member.role)}
              value={member.role}
              variant='unstyled'
              allowDeselect={false}
            />
          ) : (
            <p>{member.role}</p>
          )}
        </Table.Td>

        <Table.Td>{dayjs(member?.createdAt).format('DD/MM/YYYY')}</Table.Td>

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

              {getEditableRoles(operatorMember?.role, member.role).length !==
                0 && (
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
              )}
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    ))
  }, [members])

  return (
    <div className='flex flex-[5] flex-col'>
      <div className='flex h-12 w-full items-center justify-end gap-2'>
        <Input
          className='flex h-[30px] items-center rounded bg-gray-100'
          size='sm'
          placeholder='Search members'
          leftSection={<IconSearch size={14} />}
          classNames={{
            input: 'bg-transparent border-none min-h-[20px] h-[20px]'
          }}
          value={search}
          onChange={e => setSearch(e.currentTarget.value)}
          rightSectionPointerEvents='all'
          rightSection={
            <CloseButton
              className='hover:bg-gray-200'
              size={20}
              aria-label='Clear input'
              onClick={() => setSearch('')}
              style={{ display: search ? undefined : 'none' }}
            />
          }
        />
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
    </div>
  )
}
