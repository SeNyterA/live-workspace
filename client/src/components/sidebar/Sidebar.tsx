import {
  ActionIcon,
  Avatar,
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
  IconUserBolt,
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
import {
  EMemberRole,
  EMemberStatus,
  EWorkspaceType,
  TWorkspace
} from '../../types'
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
        body: 'overflow-visible',
        section: 'data-[position="left"]:me-[8px]'
      }}
      className='h-8 overflow-visible p-1 pl-1'
      leftSection={
        workspace.type === EWorkspaceType.Direct ? (
          <Watching
            watchingFn={state =>
              state.workspace.users[
                Object.values(state.workspace.members).find(
                  e =>
                    e.workspaceId === workspace.id &&
                    e.userId !== state.auth.userInfo?.id
                )?.userId!
              ]
            }
          >
            {user => (
              <Watching
                watchingFn={state =>
                  state.workspace.files[user?.avatarId!]?.path
                }
              >
                {path => <Avatar src={path} size={20} radius={4} />}
              </Watching>
            )}
          </Watching>
        ) : (
          <Watching
            watchingFn={state =>
              state.workspace.files[workspace?.avatarId!]?.path
            }
          >
            {path => (
              <Avatar
                classNames={{ placeholder: 'text-xs' }}
                src={path}
                size={20}
                radius={4}
                className='text-base'
              >
                {workspace.title[0]?.toUpperCase()}
              </Avatar>
            )}
          </Watching>
        )
      }
      label={
        <div className='flex items-center gap-2'>
          <p className='flex-1 truncate'>
            {workspace.type === EWorkspaceType.Direct ? (
              <Watching
                watchingFn={state =>
                  state.workspace.users[
                    Object.values(state.workspace.members).find(
                      e =>
                        e.workspaceId === workspace.id &&
                        e.userId !== state.auth.userInfo?.id
                    )?.userId!
                  ]
                }
              >
                {user => (
                  <>
                    {workspace.title ||
                      user?.nickName ||
                      user?.userName ||
                      user?.email}
                  </>
                )}
              </Watching>
            ) : (
              <>{workspace.title || workspace.id}</>
            )}
          </p>

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
  const team = useAppSelector(state => state.workspace.workspaces[teamId!])
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <div className='sidebar mb-4 flex w-72 flex-col gap-2 rounded-lg px-4 py-3 shadow-custom'>
        <p className='text-xl'>{team ? team?.title : 'Personal'}</p>
        <p className='line-clamp-3 text-gray-500'>
          {team ? team?.description : 'Wellcome to workspace'}
        </p>

        <Watching
          watchingFn={state => state.workspace.files[team?.thumbnailId!]?.path}
        >
          {path =>
            path && (
              <Image
                loading='lazy'
                src={path}
                className='aspect-video w-full rounded-lg'
              />
            )
          }
        </Watching>

        <div className='flex items-center justify-center gap-2'>
          <Input
            className='flex h-[32px] flex-1 items-center rounded'
            size='sm'
            placeholder='Search on workspace'
            leftSection={<IconSearch size={16} />}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
          />
          {!!team && (
            <ActionIcon
              size={32}
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
          )}
        </div>

        <div className='relative flex-1'>
          <ScrollArea
            scrollbarSize={6}
            className='absolute inset-0 overflow-visible'
          >
            {team && (
              <>
                <NavLink
                  className='sticky top-0 z-10 mb-1 h-8 p-1'
                  label='Boards'
                  leftSection={
                    <IconLayoutKanban
                      className='scale-90'
                      size={20}
                      stroke={1.5}
                    />
                  }
                  active={path.pathname.includes('board')}
                  defaultOpened={!!boardId}
                  classNames={{
                    children: 'pl-0 mb-2',
                    section: 'data-[position="left"]:me-[8px]'
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

                  <Watching
                    watchingFn={state =>
                      !!Object.values(state.workspace.members).find(
                        e =>
                          e.workspaceId === teamId &&
                          e.role === EMemberRole.Admin &&
                          e.status === EMemberStatus.Active &&
                          e.userId === state.auth.userInfo?.id
                      )
                    }
                  >
                    {canCreate =>
                      canCreate && (
                        <NavLink
                          className='h-8 p-1 opacity-70'
                          label={`Create board`}
                          classNames={{
                            section: 'data-[position="left"]:me-[8px]'
                          }}
                          leftSection={
                            <ActionIcon size={20}>
                              <IconPlus size={16} />
                            </ActionIcon>
                          }
                          onClick={() => {
                            setToggle(EWorkspaceType.Board)
                          }}
                        />
                      )
                    }
                  </Watching>
                </NavLink>

                <NavLink
                  className='sticky top-0 z-10 mb-1 h-8 p-1'
                  label='Channels'
                  leftSection={<IconHash className='scale-90' size={20} />}
                  active={path.pathname.includes('channel')}
                  defaultOpened={!!channelId}
                  classNames={{
                    children: 'pl-0 mb-2',
                    section: 'data-[position="left"]:me-[8px]'
                  }}
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

                  <Watching
                    watchingFn={state =>
                      Object.values(state.workspace.members).find(
                        e =>
                          e.workspaceId === teamId &&
                          e.role === EMemberRole.Admin &&
                          e.status === EMemberStatus.Active &&
                          e.userId === state.auth.userInfo?.id
                      )
                    }
                  >
                    {canCreate =>
                      canCreate && (
                        <NavLink
                          className='h-8 p-1 opacity-70'
                          label={`Create channel`}
                          classNames={{
                            section: 'data-[position="left"]:me-[8px]'
                          }}
                          leftSection={
                            <ActionIcon size={20}>
                              <IconPlus size={16} />
                            </ActionIcon>
                          }
                          onClick={() => {
                            setToggle(EWorkspaceType.Channel)
                          }}
                        />
                      )
                    }
                  </Watching>
                </NavLink>

                <Divider variant='dashed' className='border-gray-200/20' />
              </>
            )}

            <NavLink
              className='sticky top-0 z-10 mb-1 mt-1 h-8 p-1'
              label='Groups'
              leftSection={<IconUsersGroup className='scale-90' size={20} />}
              active={!!groupId}
              defaultOpened={!!groupId}
              classNames={{
                children: 'pl-0 mb-2',
                section: 'data-[position="left"]:me-[8px]'
              }}
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
                className='h-8 p-1 opacity-70'
                label={`Create group`}
                classNames={{ section: 'data-[position="left"]:me-[8px]' }}
                leftSection={
                  <ActionIcon size={20}>
                    <IconPlus size={16} />
                  </ActionIcon>
                }
                onClick={() => {
                  setToggle(EWorkspaceType.Group)
                }}
              />
            </NavLink>

            <NavLink
              className='sticky top-0 z-10 mb-1 h-8 p-1'
              label='Drirects'
              leftSection={<IconUserBolt className='scale-90' size={20} />}
              active={!!directId}
              defaultOpened={!!directId}
              classNames={{
                children: 'pl-0 mb-2',
                section: 'data-[position="left"]:me-[8px]'
              }}
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

              {/* <NavLink
                className='p-1 pl-3 opacity-70'
                label={`Create direct`}
                rightSection={<IconPlus size={16} />}
                onClick={() => {
                  setToggle(EWorkspaceType.Direct)
                }}
              /> */}
            </NavLink>
          </ScrollArea>
        </div>
      </div>

      <Drawer
        onClose={() => setToggle(undefined)}
        opened={!!toggle}
        title={<p className='text-lg font-semibold'>Create {toggle}</p>}
        overlayProps={{
          blur: 0.5
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
