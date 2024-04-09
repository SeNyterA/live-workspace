import { Avatar, Drawer, Tabs } from '@mantine/core'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import Watching from '../../../redux/Watching'
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
      opened={!!workspaceSettingId && workspaceSettingId !== 'personal'}
      title={
        <div className='flex items-center justify-center gap-1 text-lg'>
          <Watching
            watchingFn={state =>
              state.workspace.files[workspace?.avatarId!].path
            }
          >
            {path =>
              !!path && <Avatar src={path} size={28} className='rounded' />
            }
          </Watching>

          <p className='h-fit leading-[18px]'>{workspace?.title}</p>
        </div>
      }
      overlayProps={{
        blur: '0.5'
      }}
      classNames={{
        header: 'bg-transparent',
        content: 'rounded-lg flex flex-col bg-black/80',
        inner: 'p-3',
        body: 'flex flex-col flex-1 relative text-sm',
        root: 'text-gray-100'
      }}
      size={376}
      position={position || 'left'}
    >
      <Tabs defaultValue='info'>
        <Tabs.List>
          <Tabs.Tab value='info'>Infomation</Tabs.Tab>
          <Tabs.Tab value='members'>Members</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='members'>
          <MembersSetting />
        </Tabs.Panel>
        <Tabs.Panel value='info'>
          <InfoSetting />
        </Tabs.Panel>
      </Tabs>
    </Drawer>
  )
}
