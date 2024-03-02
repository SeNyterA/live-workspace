import {
  ActionIcon,
  Divider,
  Drawer,
  Image,
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
import { EWorkspaceStatus, TWorkspace, WorkspaceType } from '../../types'
import CreateWorkspace from '../workspace/create/CreateWorkspace'

function WorkspaceNav({ workspace }: { workspace: TWorkspace }) {
  const { channelId } = useAppParams()
  const unreadCount = useAppSelector(
    state => state.workspace.unreadCount[workspace._id]
  )
  const { switchTo } = useAppControlParams()

  return (
    <NavLink
      classNames={{ label: 'truncate max-w-[220px] block flex-1' }}
      className='p-1 pl-3'
      label={
        <div className='flex items-center gap-2'>
          <span className='flex-1 truncate'>
            {workspace.title || workspace._id}
          </span>
          {unreadCount && (
            <span className='h-4 min-w-4 rounded-full bg-gray-300 px-1 text-center text-xs leading-4 text-gray-800'>
              {unreadCount}
            </span>
          )}
        </div>
      }
      active={channelId === workspace._id}
      onClick={() => {
        switchTo({
          target: workspace.type as any,
          targetId: workspace._id
        })
      }}
    />
  )
}

export default function Sidebar() {
  const { channelId, teamId, boardId, groupId, directId } = useAppParams()
  const dispatch = useDispatch()
  const path = useLocation()
  const [toggle, setToggle] = useState<WorkspaceType>()
  const team = useAppSelector(state => {
    return Object.values(state.workspace.workspaces).find(e => e._id === teamId)
  })
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <div className='flex w-72 flex-col gap-2 px-4 py-3'>
        <p className='text-xl'>{team ? team?.title : 'Personal'}</p>
        <p className='line-clamp-3 text-gray-500'>
          {team ? team?.description : 'Wellcome to workspace'}
        </p>

        {!!team?.thumbnail?.path && (
          <Image
            src={team?.thumbnail?.path}
            className='aspect-video w-full rounded-lg'
          />
        )}

        <div className='flex items-center justify-center gap-2'>
          <Input
            className='flex h-[30px] flex-1 items-center rounded bg-gray-100'
            size='sm'
            placeholder='Search on workspace'
            leftSection={<IconSearch size={16} />}
            classNames={{
              input: 'bg-transparent border-none min-h-[20px] h-[20px]'
            }}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          <Watching
            watchingFn={state => {
              return Object.values(state.workspace.members).find(
                e =>
                  e.userId === state.auth.userInfo?._id && e.targetId === teamId
              )?.role
            }}
          >
            {myTeamRole => (
              <>
                {true && (
                  <ActionIcon
                    variant='transparent'
                    aria-label='Settings'
                    className='h-[30px] w-[30px] bg-gray-100'
                    onClick={() =>
                      dispatch(
                        workspaceActions.toggleWorkspaceSetting({
                          settingPosition: 'left',
                          workspaceSettingId: teamId!
                        })
                      )
                    }
                  >
                    <IconSettings
                      style={{ width: '70%', height: '70%' }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                )}
              </>
            )}
          </Watching>
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
                  className='sticky top-0 z-10 mb-1 bg-white p-1'
                  label='Boards'
                  leftSection={<IconLayoutKanban size={16} stroke={1.5} />}
                  active={path.pathname.includes('board')}
                  defaultOpened={!!boardId}
                  classNames={{
                    children: 'pl-6'
                  }}
                >
                  <Watching
                    watchingFn={state =>
                      Object.values(state.workspace.workspaces).filter(
                        e =>
                          e.type === WorkspaceType.Board &&
                          e.parentId === teamId
                      )
                    }
                  >
                    {boards => (
                      <>
                        {boards?.map(item => (
                          <WorkspaceNav workspace={item} key={item._id} />
                        ))}
                      </>
                    )}
                  </Watching>

                  <NavLink
                    className='mb-2 p-1 pl-3 opacity-70'
                    label={`Create board`}
                    rightSection={<IconPlus size={16} stroke={1.5}/>}
                    onClick={() => {
                      setToggle(WorkspaceType.Board)
                    }}
                  />
                </NavLink>

                <NavLink
                  className='sticky top-0 z-10 mb-1 bg-white p-1'
                  label='Channels'
                  leftSection={<IconHash size='1rem' stroke={1.5} />}
                  active={path.pathname.includes('channel')}
                  defaultOpened={!!channelId}
                >
                  <Watching
                    watchingFn={state =>
                      Object.values(state.workspace.workspaces).filter(
                        e =>
                          e.type === WorkspaceType.Channel &&
                          e.parentId === teamId
                      )
                    }
                  >
                    {channels => (
                      <>
                        {channels?.map(item => (
                          <WorkspaceNav workspace={item} key={item._id} />
                        ))}
                      </>
                    )}
                  </Watching>

                  <NavLink
                    className='mb-2 p-1 pl-3 opacity-70'
                    label={`Create channel`}
                    rightSection={<IconPlus size={16} stroke={1.5}/>}
                    onClick={() => {
                      setToggle(WorkspaceType.Channel)
                    }}
                  />
                </NavLink>

                <Divider variant='dashed' />
              </>
            )}

            <NavLink
              className='sticky top-0 z-10 mb-1 bg-white p-1'
              label='Groups'
              leftSection={<IconUsersGroup size='1rem' stroke={1.5} />}
              active={!!groupId}
              defaultOpened={!!groupId}
              classNames={{ children: 'w-full' }}
            >
              <Watching
                watchingFn={state =>
                  Object.values(state.workspace.workspaces).filter(
                    e => e.type === WorkspaceType.Group
                  )
                }
              >
                {groups => (
                  <>
                    {groups?.map(item => (
                      <WorkspaceNav workspace={item} key={item._id} />
                    ))}
                  </>
                )}
              </Watching>

              <NavLink
                className='mb-2 p-1 pl-3 opacity-70'
                label={`Create group`}
                rightSection={<IconPlus size={16} stroke={1.5}/>}
                onClick={() => {
                  setToggle(WorkspaceType.Group)
                }}
              />
            </NavLink>

            <NavLink
              className='sticky top-0 z-10 mb-1 bg-white p-1'
              label='Drirects'
              leftSection={<IconUsersGroup size='1rem' stroke={1.5} />}
              active={!!directId}
              defaultOpened={!!directId}
              classNames={{ children: 'w-full' }}
            >
              <Watching
                watchingFn={state =>
                  Object.values(state.workspace.workspaces).filter(
                    e => e.type === WorkspaceType.DirectMessage
                  )
                }
              >
                {directs => (
                  <>
                    {directs?.map(item => (
                      <WorkspaceNav workspace={item} key={item._id} />
                    ))}
                  </>
                )}
              </Watching>

              <NavLink
                className='mb-2 p-1 pl-3 opacity-70'
                label={`Create direct`}
                rightSection={<IconPlus size={16} stroke={1.5}/>}
                onClick={() => {
                  setToggle(WorkspaceType.DirectMessage)
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
          content: 'rounded-lg flex flex-col',
          inner: 'p-3',
          body: 'flex flex-col flex-1 relative text-sm'
        }}
        size={400}
        position={'left'}
      >
        <CreateWorkspace
          defaultValues={{
            workspace: {
              type: WorkspaceType.Channel,
              status: EWorkspaceStatus.Public
            } as any
          }}
        />
      </Drawer>
    </>
  )
}
