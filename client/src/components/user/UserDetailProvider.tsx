import { ActionIcon, Avatar, Menu } from '@mantine/core'
import { IconMessageCircle } from '@tabler/icons-react'
import { ReactNode } from 'react'
import useAppControlParams from '../../hooks/useAppControlParams'
import Watching from '../../redux/Watching'
import { EWorkspaceType, TUser } from '../../types'

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
        <ActionIcon className='h-fit w-fit overflow-visible'>
          {children}
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <div className='flex flex-col items-center justify-center p-4 pb-0'>
          <Watching
            watchingFn={state => state.workspace.files[user?.avatarId!]}
          >
            {avatar => <Avatar src={avatar?.path} size={120} />}
          </Watching>
          <p className='mt-2 text-base font-semibold'>{user?.nickName}</p>
          <p className='text-sm text-gray-500'>{`@${user?.userName}`}</p>
          <p className='text-sm text-gray-500'>{user?.email}</p>
        </div>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconMessageCircle size={14} />}
          onClick={() => {
            if (!user?.id) return
            switchTo({
              target: EWorkspaceType.Direct,
              targetId: user.id
            })
          }}
        >
          Messages
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
