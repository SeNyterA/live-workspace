import {
  ActionIcon,
  Divider,
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
import { useLocation } from 'react-router-dom'
import useAppParams from '../../hooks/useAppParams'
import { WorkspaceType } from '../../new-types/workspace.d'
import { useAppSelector } from '../../redux/store'
import Watching from '../../redux/Watching'
import TeamSetting from '../team-setting/TeamSetting'
import BoardItem from './board/BoardItem'
import CreateBoard from './board/CreateBoard'
import ChannelItem from './channel/ChannelItem'
import CreateChannel from './channel/CreateChannel'
import CreateGroup from './CreateGroup'
import GroupItem from './group/GroupItem'

export type TSideBarToggle =
  | 'createBoard'
  | 'createChannel'
  | 'createGroup'
  | 'teamSetting'
  | 'createDirect'
  | 'createGroup'

export default function Sidebar() {
  const { channelId, teamId, boardId, groupId } = useAppParams()

  const path = useLocation()
  const [toggle, setToggle] = useState<TSideBarToggle>()
  const team = useAppSelector(state => {
    return Object.values(state.workspace.workspaces).find(e => e._id === teamId)
  })
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <div className='flex w-72 flex-col gap-2 px-4 py-3'>
        <div className=''>
          <p className='text-xl'>{team?.title}</p>
          <p className='text-gray-500'>{team?.description}</p>
          <Image
            src={team?.thumbnail?.path}
            className='max-h-32 w-full rounded-lg'
          />
        </div>
        <div className='flex items-center justify-center gap-2'>
          <Input
            className='flex h-[30px] flex-1 items-center rounded bg-gray-100'
            size='sm'
            placeholder='Search on workspace'
            leftSection={<IconSearch size={14} />}
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
                    onClick={() => setToggle('teamSetting')}
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
                  leftSection={<IconLayoutKanban size='1rem' stroke={1.5} />}
                  active={path.pathname.includes('board')}
                  defaultOpened={!!boardId}
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
                          <BoardItem board={item} key={item._id} />
                        ))}
                      </>
                    )}
                  </Watching>

                  <NavLink
                    className='mb-2 p-1 pl-3 opacity-70'
                    label={`Create board`}
                    rightSection={<IconPlus size={14} />}
                    onClick={() => {
                      setToggle('createBoard')
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
                          <ChannelItem channel={item} key={item._id} />
                        ))}
                      </>
                    )}
                  </Watching>

                  <NavLink
                    className='mb-2 p-1 pl-3 opacity-70'
                    label={`Create channel`}
                    rightSection={<IconPlus size={14} />}
                    onClick={() => {
                      setToggle('createChannel')
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
                      <GroupItem key={item._id} group={item} />
                    ))}
                  </>
                )}
              </Watching>

              <NavLink
                className='mb-2 p-1 pl-3 opacity-70'
                label={`Create group`}
                rightSection={<IconPlus size={14} />}
                onClick={() => {
                  setToggle('createGroup')
                }}
              />
            </NavLink>
          </ScrollArea>
        </div>
      </div>

      <TeamSetting
        isOpen={toggle === 'teamSetting'}
        onClose={() => setToggle(undefined)}
        targetId={teamId!}
        type='team'
      />

      <CreateGroup
        isOpen={toggle === 'createGroup'}
        onClose={() => setToggle(undefined)}
        refetchKey={toggle}
      />

      <CreateChannel
        isOpen={toggle === 'createChannel'}
        onClose={() => setToggle(undefined)}
        refetchKey={toggle}
      />

      <CreateBoard
        isOpen={toggle === 'createBoard'}
        onClose={() => setToggle(undefined)}
        refetchKey={toggle}
      />
    </>
  )
}
