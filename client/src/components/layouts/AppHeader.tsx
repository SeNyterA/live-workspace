import { ActionIcon, Avatar, Menu, Text, rem } from '@mantine/core'
import {
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconTrash
} from '@tabler/icons-react'

export default function AppHeader() {
  return (
    <div className='h-12 flex gap-3 items-center px-3'>
      <p className='text-xl font-semibold'>Live workspace - Senytera</p>
      <div className='flex-1 items-center justify-center flex'>
        {/* <Input size='xs' placeholder='search any thing' className='w-96'/> */}
      </div>

      <Menu shadow='md' width={200} position='bottom-end' withArrow>
        <Menu.Target>
          <ActionIcon className='p-0 rounded-full'>
            <Avatar />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item
            leftSection={
              <IconSettings style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Settings
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Messages
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconPhoto style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Gallery
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconSearch style={{ width: rem(14), height: rem(14) }} />
            }
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
          <Menu.Item
            leftSection={
              <IconArrowsLeftRight
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Transfer my data
          </Menu.Item>
          <Menu.Item
            color='red'
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
          >
            Delete my account
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  )
}
