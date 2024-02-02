import {
  ActionIcon,
  Avatar,
  Group,
  Menu,
  rem,
  Table,
  Text
} from '@mantine/core'
import {
  IconAt,
  IconDots,
  IconMessages,
  IconNote,
  IconPencil,
  IconPhoneCall,
  IconReportAnalytics,
  IconTrash
} from '@tabler/icons-react'

const data = [
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    rate: 45
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    rate: 76
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    rate: 15
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    rate: 98
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    rate: 22
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    rate: 45
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    rate: 76
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    rate: 15
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    rate: 98
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    rate: 22
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    rate: 45
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    rate: 76
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    rate: 15
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    rate: 98
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    rate: 22
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    rate: 45
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    rate: 76
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    rate: 15
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    rate: 98
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    rate: 22
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    rate: 45
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    rate: 76
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    rate: 15
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    rate: 98
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    rate: 22
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    rate: 45
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    rate: 76
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    rate: 15
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    rate: 98
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    rate: 22
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    rate: 45
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    rate: 76
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    rate: 15
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    rate: 98
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
    name: 'Robert Wolfkisser',
    job: 'Engineer',
    email: 'rob_wolf@gmail.com',
    rate: 22
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
    name: 'Jill Jailbreaker',
    job: 'Engineer',
    email: 'jj@breaker.com',
    rate: 45
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Henry Silkeater',
    job: 'Designer',
    email: 'henry@silkeater.io',
    rate: 76
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png',
    name: 'Bill Horsefighter',
    job: 'Designer',
    email: 'bhorsefighter@gmail.com',
    rate: 15
  },
  {
    avatar:
      'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
    name: 'Jeremy Footviewer',
    job: 'Manager',
    email: 'jeremy@foot.dev',
    rate: 98
  }
]

export function UsersStack() {
  const rows = data.map(item => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <div>
          <Group wrap='nowrap'>
            <Avatar
              src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png'
              size={94}
              radius='md'
            />
            <div>
              <Text fz='xs' tt='uppercase' fw={700} c='dimmed'>
                Software engineer
              </Text>

              <Text fz='lg' fw={500}>
                Robert Glassbreaker
              </Text>

              <Group wrap='nowrap' gap={10} mt={3}>
                <IconAt stroke={1.5} size='1rem' />
                <Text fz='xs' c='dimmed'>
                  robert@glassbreaker.io
                </Text>
              </Group>

              <Group wrap='nowrap' gap={10} mt={5}>
                <IconPhoneCall stroke={1.5} size='1rem' />
                <Text fz='xs' c='dimmed'>
                  +11 (876) 890 56 23
                </Text>
              </Group>
            </div>
          </Group>
        </div>
      </Table.Td>
      <Table.Td>
        {/* <Select
          data={[EMemberRole.Owner, EMemberRole.Admin, EMemberRole.Member]}
          value={EMemberRole.Member}
          variant='unstyled'
          allowDeselect={false}
        /> */}
      </Table.Td>
      <Table.Td>
        <Text fz='sm'>${item.rate.toFixed(1)} / hr</Text>
        <Text fz='xs' c='dimmed'>
          Rate
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify='flex-end'>
          <ActionIcon variant='subtle' color='gray'>
            <IconPencil
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
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
                  <IconNote
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Add note
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconReportAnalytics
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Analytics
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
                Terminate contract
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Table stickyHeader stickyHeaderOffset={0}>
      <Table.Thead>
        <Table.Tr className=''>
          <Table.Th>Employee</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Last active</Table.Th>
          <Table.Th>Status</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
