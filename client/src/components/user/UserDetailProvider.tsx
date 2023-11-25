import { ActionIcon, Menu, Text } from '@mantine/core'
import {
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash
} from '@tabler/icons-react'
import { ReactNode } from 'react'
import { TUser } from '../../types/user.type'

export default function UserDetailProvider({
  children
}: {
  children: ReactNode
  user?: TUser
}) {
  return (
    <>
      <Menu shadow='md' width={200} position='bottom-end' withArrow>
        <Menu.Target>
          <ActionIcon
            variant='transparent'
            className='h-fit min-h-0 w-fit min-w-0'
          >
            {children}
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item leftSection={<IconSettings size={14} />}>
            Settings
          </Menu.Item>
          <Menu.Item leftSection={<IconMessageCircle size={14} />}>
            Messages
          </Menu.Item>
          <Menu.Item leftSection={<IconPhoto size={14} />}>Gallery</Menu.Item>
          <Menu.Item
            leftSection={<IconSearch size={14} />}
            rightSection={
              <Text size='xs' c='dimmed'>
                ⌘K
              </Text>
            }
          >
            Search
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item leftSection={<IconArrowsLeftRight size={14} />}>
            Transfer my data
          </Menu.Item>
          <Menu.Item
            color='red'
            leftSection={<IconTrash size={14} />}
            // onClick={() => lsActions.clearLS(true)}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  )
}
