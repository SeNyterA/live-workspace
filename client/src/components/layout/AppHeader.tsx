import { ActionIcon, Avatar, Menu, rem } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useAppSelector } from '../../redux/store'
import Watching from '../../redux/Watching'
import { lsActions } from '../../utils/auth'
import Notification from './Notification'

export default function AppHeader() {
  const user = useAppSelector(state => state.auth.userInfo)

  return (
    <div className='flex h-12 items-center gap-3 px-3'>
      <p className='text-xl font-semibold'>Live workspace - Senytera</p>
      <div className='flex flex-1 items-center justify-center'></div>
      <Notification />
      <Menu shadow='md' width={200} position='bottom-end' withArrow>
        <Menu.Target>
          <ActionIcon
            className='flex h-fit w-fit items-center justify-center rounded-full p-0 ring-1'
            variant='light'
            size='md'
          >
            <Watching
              watchingFn={state => state.workspace.files[user?.avatarId!]}
            >
              {avatar => (
                <Avatar src={avatar?.path} size={32}>
                  {user?.userName[0].toUpperCase()}
                </Avatar>
              )}
            </Watching>
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <div className='flex flex-col items-center justify-center p-3'>
            <Watching
              watchingFn={state => state.workspace.files[user?.avatarId!]}
            >
              {avatar => (
                <Avatar src={avatar?.path} size={100}>
                  {user?.userName[0].toUpperCase()}
                </Avatar>
              )}
            </Watching>

            <p className='mt-2 text-lg font-semibold'>{user?.userName}</p>
            <p className='text-sm text-gray-500'>{user?.email}</p>
          </div>

          {/* <Menu.Label>Application</Menu.Label>
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

          <Menu.Divider /> */}
          <Menu.Divider />
          {/* <Menu.Label>Danger zone</Menu.Label> */}
          {/* <Menu.Item
            leftSection={
              <IconArrowsLeftRight
                style={{ width: rem(14), height: rem(14) }}
              />
            }
          >
            Transfer my data
          </Menu.Item> */}
          <Menu.Item
            color='red'
            leftSection={
              <IconTrash style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={() => lsActions.clearLS(true)}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  )
}
