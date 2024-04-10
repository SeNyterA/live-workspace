import { ActionIcon, Avatar, Image, ScrollArea } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../../hooks/useAppParams'
import { workspaceActions } from '../../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../../redux/store'
import Files from './Files'
import Members from './Members'
import PinedMesages from './PinedMesages'

export default function Info() {
  const { channelId, directId, groupId, boardId } = useAppParams()
  const dispatch = useDispatch()
  const workspaceId = channelId || groupId || directId || boardId || ''

  const workspace = useAppSelector(state => ({
    ...state.workspace.workspaces[workspaceId],
    avatar:
      state.workspace.files[state.workspace.workspaces[workspaceId]?.avatarId!],
    thumbnail:
      state.workspace.files[
        state.workspace.workspaces[workspaceId]?.thumbnailId!
      ]
  }))

  // const { t } = useTranslation(['ns1', 'ns2'])
  // console.log(t('setting.name', { name: workspace?.title }))

  return (
    <>
      <div className='flex w-80 flex-col px-4 py-3'>
        <div className='flex items-center justify-between gap-2 pb-1'>
          {workspace?.avatar?.path && (
            <Avatar
              src={workspace?.avatar?.path}
              size={28}
              className='rounded'
            />
          )}

          <p className='flex-1 text-base font-semibold'>{workspace?.title}</p>
          <ActionIcon
            size={30}
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
        {workspace?.description && (
          <p className='text-gray-500'>{workspace?.description}</p>
        )}

        {workspace?.thumbnail?.path && (
          <Image
            loading='lazy'
            src={workspace?.thumbnail?.path}
            className='aspect-video w-full rounded-lg'
          />
        )}

        <div className='relative mt-2 flex-1'>
          <ScrollArea
            className='absolute inset-0 right-[-12px] pr-3'
            scrollbarSize={8}
          >
            <Members />
            {!!(channelId || groupId || directId) && <PinedMesages />}
            {/* <Files /> */}
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
