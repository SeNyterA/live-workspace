import { Avatar, Indicator, Menu, rem, Text } from '@mantine/core'
import {
  IconArrowsLeftRight,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings
} from '@tabler/icons-react'
import { useAppSelector } from '../../redux/store'
import { TUser } from '../../types'

export default function UserAvatar({
  user,
  size = 36,
  zIndex = 1
}: {
  user?: TUser
  size?: number
  zIndex?: number
}) {
  const avatar = useAppSelector(state => state.workspace.files[user?.avatarId!])
  const presence = useAppSelector(state => state.workspace.presents[user?.id!])
  return (
    <Menu
      shadow='md'
      position='bottom-start'
      classNames={{
        item: 'text-gray-100 hover:bg-blue-400/20',
        arrow: 'border-none'
      }}
      disabled={!user}
    >
      <Menu.Target>
        <Indicator
          inline
          size={12}
          offset={5}
          position='bottom-end'
          color={presence === 'online' ? 'green' : 'gray'}
          processing={presence === 'online'}
          zIndex={zIndex}
          disabled={!user || !presence}
          className='h-fit w-fit'
        >
          <Avatar src={avatar?.path} size={size}>
            <span className='capitalize'>{user?.userName[0]}</span>
          </Avatar>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown className='rounded-xl border-none !bg-slate-950/90 p-4 text-gray-100 shadow-none'>
        <div className='flex flex-col items-center justify-center p-3'>
          <Avatar src={avatar?.path} size={100}>
            <span className='capitalize'>{user?.userName[0]}</span>
          </Avatar>

          <p className='mt-2 text-lg font-semibold'>{user?.userName}</p>
          <p className='text-sm text-gray-500'>{user?.email}</p>
        </div>

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
            <IconArrowsLeftRight style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Transfer my data
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
