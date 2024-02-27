import { ActionIcon, Avatar, Menu } from '@mantine/core'
import { IconMessageCircle } from '@tabler/icons-react'
import { ReactNode } from 'react'
import useAppControlParams from '../../hooks/useAppControlParams'
import { TUser } from '../../new-types/user'

export default function UserDetailProvider({
  children,
  user
}: {
  children: ReactNode
  user?: TUser
}) {
  const { switchTo } = useAppControlParams()
  return (
    <Menu shadow='md' width={200} position='top-start' withArrow>
      <Menu.Target>
        <ActionIcon
          variant='transparent'
          className='h-fit w-fit overflow-visible'
        >
          {children}
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <div className='flex flex-col items-center justify-center p-4 pb-0'>
          <Avatar src={user?.avatar?.path} size={120} />
          <p className='mt-2 text-base font-semibold'>{user?.nickName}</p>
          <p className='text-sm text-gray-500'>{`@${user?.userName}`}</p>
          <p className='text-sm text-gray-500'>{user?.email}</p>
        </div>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconMessageCircle size={14} />}
          onClick={() => {
            if (!user?._id) return
            switchTo({ target: 'direct-message', targetId: user._id })
          }}
        >
          Messages
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
