import { Avatar, Drawer, Tabs } from '@mantine/core'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import InfoSetting from './InfoSetting'
import MembersSetting from './MembersSetting'

export default function WorkspaceSetting() {
  const dispatch = useDispatch()
  const workspaceSettingId = useAppSelector(
    state => state.workspace.workspaceSettingId
  )
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )
  const position = useAppSelector(state => state.workspace.settingPosition)

  return (
    <Drawer
      onClose={() =>
        dispatch(
          workspaceActions.toggleWorkspaceSetting({
            workspaceSettingId: undefined
          })
        )
      }
      opened={!!workspaceSettingId}
      title={
        <div className='flex items-center justify-center gap-1 text-lg'>
          {workspace?.avatar?.path && (
            <Avatar
              src={workspace?.avatar?.path}
              size={28}
              className='rounded'
            />
          )}
          <p className='h-fit leading-[18px]'>{workspace?.title}</p>
        </div>
      }
      overlayProps={{
        color: '#000',
        backgroundOpacity: 0.2,
        blur: 0.5
      }}
      classNames={{
        content: 'rounded-lg flex flex-col',
        inner: 'p-3',
        body: 'flex flex-col flex-1 relative text-sm'
      }}
      size={400}
      position={position || 'left'}
    >
      <Tabs
        defaultValue='info'
        classNames={{
          root: 'h-full flex flex-col',
          panel: 'flex-1'
        }}
      >
        <Tabs.List>
          <Tabs.Tab value='info'>Infomation</Tabs.Tab>
          <Tabs.Tab value='members'>Members</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='members' className='relative'>
          <MembersSetting />
        </Tabs.Panel>
        <Tabs.Panel value='info' className='relative'>
          <InfoSetting />
        </Tabs.Panel>
      </Tabs>
    </Drawer>
  )
}
