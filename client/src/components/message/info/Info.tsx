import { ActionIcon, ScrollArea } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import Files from './Files'
import Members from './Members'
import PinedMesages from './PinedMesages'

export default function Info() {
  const { channelId, directId, groupId, boardId } = useAppParams()
  const dispatch = useDispatch()

  const workspace = useAppSelector(
    state =>
      state.workspace.workspaces[
        channelId || groupId || directId || boardId || ''
      ]
  )

  return (
    <>
      <div className='flex w-80 flex-col py-3'>
        <div className='flex justify-between px-4'>
          <div>
            <p className='text-base'>{workspace?.title}</p>
            <p className='text-xs text-gray-500'>{workspace?.description}</p>
            {/* <p className='text-xs text-gray-500'>
              id: {channelId || directId || groupId || boardId}
            </p> */}
          </div>
          <ActionIcon
            size={30}
            variant='light'
            color='gray'
            onClick={() =>
              dispatch(
                workspaceActions.toggleWorkspaceSetting({
                  settingPosition: 'right',
                  workspaceSettingId:
                    channelId || groupId || directId || boardId || ''
                })
              )
            }
          >
            <IconSettings size={16} />
          </ActionIcon>
        </div>

        <div className='relative mt-2 flex-1 px-4'>
          <ScrollArea
            className='absolute inset-0 space-y-6 px-4'
            scrollbarSize={8}
          >
            <Members />
            {!!(channelId || groupId || directId) && <PinedMesages />}
            <Files />
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
