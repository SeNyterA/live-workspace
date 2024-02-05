import {
  ActionIcon,
  Avatar,
  Indicator,
  Menu,
  rem,
  ScrollArea,
  Table
} from '@mantine/core'
import { IconDots, IconMessage, IconPlus } from '@tabler/icons-react'
import { useMemo } from 'react'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'

export function InviteMember() {
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
  }, [members])

  return (
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

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </div>
  )
}
