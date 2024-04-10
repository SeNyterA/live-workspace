import { on } from 'events'
import { Avatar, Indicator, Menu, rem, Text } from '@mantine/core'
import {
  IconLogout,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings
} from '@tabler/icons-react'
import { set } from 'lodash'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../hooks/useAppControlParams'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { appMutationFn } from '../../services/apis/mutations/useAppMutation'
import { EWorkspaceType, extractApi, TUser } from '../../types'
import { lsActions } from '../../utils/auth'

export default function UserAvatar({
  user,
  size = 36,
  zIndex = 1,
  showSatus = true,
  showMenu = true,
  radius = 999999,
  isSetting = false,
  onOpenSettingProfile
}: {
  user?: TUser
  size?: number
  zIndex?: number
  showSatus?: boolean
  radius?: number
  showMenu?: boolean
  isSetting?: boolean
  onOpenSettingProfile?: () => void
}) {
  const { switchTo } = useAppControlParams()
  const meId = useAppSelector(state => state.auth.userInfo?.id)

  const avatar = useAppSelector(state => state.workspace.files[user?.avatarId!])
  const presence = useAppSelector(state => state.workspace.presents[user?.id!])
  const dispath = useDispatch()
  return (
    <Menu
      shadow='md'
      position='bottom-start'
      classNames={{
        item: ' bg-transparent flex justify-between items-center',
        arrow: 'border-none'
      }}
      disabled={!user || !showMenu || (user.id === meId && !isSetting)}
      width={230}
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
          disabled={!user || !presence || !showSatus}
          className='h-fit w-fit'
        >
          <Avatar src={avatar?.path} size={size} radius={radius}>
            <span className='capitalize'>{user?.userName[0]}</span>
          </Avatar>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown className='rounded-xl border-none p-4  shadow-none'>
        <div className='flex flex-col items-center justify-center p-3'>
          <Avatar src={avatar?.path} size={100}>
            <span className='capitalize'>{user?.userName[0]}</span>
          </Avatar>

          {!!user?.nickName && (
            <p className='mt-2 break-all text-center text-lg font-semibold'>
              {user?.nickName}
            </p>
          )}
          <p className='break-all text-center text-sm '>@{user?.userName}</p>
          <p className='break-all text-center text-sm '>{user?.email}</p>
        </div>

        <Menu.Label>Application</Menu.Label>
        {meId === user?.id ? (
          <>
            <Menu.Item
              leftSection={
                <IconSettings style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => {
                onOpenSettingProfile?.()
              }}
            >
              Settings
            </Menu.Item>

            <Menu.Item
              leftSection={
                <IconPhoto style={{ width: rem(14), height: rem(14) }} />
              }
            >
              Gallery
            </Menu.Item>

            <Menu.Divider className='mx-2' />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item
              leftSection={
                <IconLogout style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={() => lsActions.clearLS(true)}
            >
              Logout
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item
              leftSection={
                <IconMessageCircle
                  style={{ width: rem(14), height: rem(14) }}
                />
              }
              onClick={() => {
                appMutationFn({
                  key: 'createDirect',
                  url: {
                    baseUrl: 'directs/:userTargetId',
                    urlParams: {
                      userTargetId: user?.id!
                    }
                  },
                  method: 'post'
                }).then(data => {
                  dispath(
                    workspaceActions.updateWorkspaceStore(
                      extractApi({
                        workspaces: [data]
                      })
                    )
                  )
                  switchTo({ target: EWorkspaceType.Direct, targetId: data.id })
                })
              }}
            >
              Messages
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
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}
