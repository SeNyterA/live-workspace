import {
  ActionIcon,
  Divider,
  Drawer,
  Image,
  Indicator,
  Input,
  NavLink,
  ScrollArea
} from '@mantine/core'
import {
  IconHash,
  IconLayoutKanban,
  IconPlus,
  IconSearch,
  IconSettings,
  IconUsersGroup
} from '@tabler/icons-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import useAppControlParams from '../../hooks/useAppControlParams'
import useAppParams from '../../hooks/useAppParams'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import Watching from '../../redux/Watching'
import { EWorkspaceType, TWorkspace } from '../../types'
import CreateWorkspace, {
  getDefaultValue
} from '../workspace/create/CreateWorkspace'

function WorkspaceNav({ workspace }: { workspace: TWorkspace }) {
  const { channelId, groupId, directId, boardId } = useAppParams()
  const targetId = channelId || groupId || directId || boardId
  const { switchTo } = useAppControlParams()
  const unReadCount = useAppSelector(
    state => state.workspace.unreads[workspace.id]
  )
  return (
    <NavLink
      classNames={{
        label: 'max-w-[220px] block flex-1 overflow-visible',
        body: 'overflow-visible'
      }}
      className='overflow-visible p-1 pl-3 hover:bg-blue-400/10'
      label={
        <div className='flex items-center gap-2'>
          <span className='flex-1 truncate'>
            {workspace.title || workspace.id}
          </span>
          {/* {unReadCount && (
            <span className='h-4 min-w-4 rounded-full bg-gray-300 px-1 text-center text-xs leading-4 text-gray-800'>
              {unReadCount}
            </span>
          )} */}

          <Indicator
            processing
            disabled={!unReadCount || workspace.id === targetId}
            className='mr-2'
          />
        </div>
      }
      active={[channelId, groupId, directId, boardId].includes(workspace.id)}
      onClick={() => {
        switchTo({
          target: workspace.type as any,
          targetId: workspace.id
        })
      }}
    />
  )
}

export default function Sidebar() {
  const { channelId, teamId, boardId, groupId, directId } = useAppParams()
  const dispatch = useDispatch()
  const path = useLocation()
  const [toggle, setToggle] = useState<EWorkspaceType>()
  const team = useAppSelector(state => ({
    ...state.workspace.workspaces[teamId!],
    thumbnail:
      state.workspace.files[state.workspace.workspaces[teamId!]?.thumbnailId!]
  }))
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <div className='mb-4 flex w-72 flex-col gap-2 rounded-lg bg-gray-800/40 px-4 py-3 shadow-custom'>
        <p className='text-xl'>{team ? team?.title : 'Personal'}</p>
        <p className='line-clamp-3 text-gray-500'>
          {team ? team?.description : 'Wellcome to workspace'}
        </p>

        {!!team?.thumbnail?.path && (
          <Image
            loading='lazy'
            src={team?.thumbnail?.path}
            className='aspect-video w-full rounded-lg'
          />
        )}

        <div className='flex items-center justify-center gap-2'>
          <Input
            className='flex h-[30px] flex-1 items-center rounded bg-gray-400/10'
            size='sm'
            placeholder='Search on workspace'
            leftSection={<IconSearch size={16} />}
            classNames={{
              input:
                'bg-transparent text-gray-100 border-none min-h-[20px] h-[20px]'
            }}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />

          <ActionIcon
            size={30}
            variant='light'
            color='gray'
            className='bg-gray-400/10'
            onClick={() =>
              dispatch(
                workspaceActions.toggleWorkspaceSetting({
                  settingPosition: 'left',
                  workspaceSettingId: teamId!
                })
              )
            }
          >
            <IconSettings size={16} />
          </ActionIcon>
        </div>

        <div className='relative flex-1'>
          <ScrollArea
            scrollbarSize={6}
            className='absolute inset-0 right-[-12px]'
            classNames={{
              viewport: 'pr-3'
            }}
          >
            {team && (
              <>
                <NavLink
                  className='sticky top-0 z-10 mb-1 p-1 hover:bg-blue-400/10'
                  label='Boards'
                  leftSection={<IconLayoutKanban size={16} stroke={1.5} />}
                  active={path.pathname.includes('board')}
                  defaultOpened={!!boardId}
                  classNames={{
                    children: 'pl-5'
                  }}
                >
                  <Watching
                    watchingFn={state =>
                      Object.values(state.workspace.workspaces).filter(
                        e =>
                          e.type === EWorkspaceType.Board &&
                          e.workspaceParentId === teamId
                      )
                    }
                  >
                    {boards => (
                      <>
                        {boards?.map(item => (
                          <WorkspaceNav workspace={item} key={item.id} />
                        ))}
                      </>
                    )}
                  </Watching>

                  <NavLink
                    className='mb-2 p-1 pl-3 opacity-70 hover:bg-blue-400/20'
                    label={`Create board`}
                    rightSection={<IconPlus size={16} stroke={1.5} />}
                    onClick={() => {
                      setToggle(EWorkspaceType.Board)
                    }}
                  />
                </NavLink>

                <NavLink
                  className='sticky top-0 z-10 mb-1 p-1 hover:bg-blue-400/10'
                  label='Channels'
                  leftSection={<IconHash size='1rem' stroke={1.5} />}
                  active={path.pathname.includes('channel')}
                  defaultOpened={!!channelId}
                >
                  <Watching
                    watchingFn={state =>
                      Object.values(state.workspace.workspaces).filter(
                        e =>
                          e.type === EWorkspaceType.Channel &&
                          e.workspaceParentId === teamId
                      )
                    }
                  >
                    {channels => (
                      <>
                        {channels?.map(item => (
                          <WorkspaceNav workspace={item} key={item.id} />
                        ))}
                      </>
                    )}
                  </Watching>

                  <NavLink
                    className='mb-2 p-1 pl-3 opacity-70 hover:bg-blue-400/20'
                    label={`Create channel`}
                    rightSection={<IconPlus size={16} stroke={1.5} />}
                    onClick={() => {
                      setToggle(EWorkspaceType.Channel)
                    }}
                  />
                </NavLink>

                <Divider variant='dashed' className='border-gray-200/20' />
              </>
            )}

            <NavLink
              className='sticky top-0 z-10 mb-1 mt-1 p-1 hover:bg-blue-400/10'
              label='Groups'
              leftSection={<IconUsersGroup size='1rem' stroke={1.5} />}
              active={!!groupId}
              defaultOpened={!!groupId}
              classNames={{ children: 'w-full' }}
            >
              <Watching
                watchingFn={state =>
                  Object.values(state.workspace.workspaces).filter(
                    e => e.type === EWorkspaceType.Group
                  )
                }
              >
                {groups => (
                  <>
                    {groups?.map(item => (
                      <WorkspaceNav workspace={item} key={item.id} />
                    ))}
                  </>
                )}
              </Watching>

              <NavLink
                className='mb-2 p-1 pl-3 opacity-70 hover:bg-blue-400/20'
                label={`Create group`}
                rightSection={<IconPlus size={16} stroke={1.5} />}
                onClick={() => {
                  setToggle(EWorkspaceType.Group)
                }}
              />
            </NavLink>

            <NavLink
              className='sticky top-0 z-10 mb-1 p-1 hover:bg-blue-400/10'
              label='Drirects'
              leftSection={<IconUsersGroup size='1rem' stroke={1.5} />}
              active={!!directId}
              defaultOpened={!!directId}
              classNames={{ children: 'w-full' }}
            >
              <Watching
                watchingFn={state =>
                  Object.values(state.workspace.workspaces).filter(
                    e => e.type === EWorkspaceType.Direct
                  )
                }
              >
                {directs => (
                  <>
                    {directs?.map(item => (
                      <WorkspaceNav workspace={item} key={item.id} />
                    ))}
                  </>
                )}
              </Watching>

              <NavLink
                className='mb-2 p-1 pl-3 opacity-70 hover:bg-blue-400/20'
                label={`Create direct`}
                rightSection={<IconPlus size={16} stroke={1.5} />}
                onClick={() => {
                  setToggle(EWorkspaceType.Direct)
                }}
              />
            </NavLink>
          </ScrollArea>
        </div>
      </div>

      <Drawer
        onClose={() => setToggle(undefined)}
        opened={!!toggle}
        title={<p className='text-lg font-semibold'>Create {toggle}</p>}
        overlayProps={{
          color: '#000',
          backgroundOpacity: 0.2,
          blur: 0.5
        }}
        classNames={{
          header: 'bg-transparent',
          content: 'rounded-lg flex flex-col bg-black/80',
          inner: 'p-3',
          body: 'flex flex-col flex-1 relative text-sm',
          root: 'text-gray-100',
          overlay: 'bg-white/10 blur'
        }}
        size={376}
        position={'left'}
      >
        <CreateWorkspace
          defaultValues={getDefaultValue(toggle!) as any}
          onClose={() => setToggle(undefined)}
        />
      </Drawer>
    </>
  )
}
