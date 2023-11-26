import { ActionIcon, Divider, Input, NavLink, ScrollArea } from '@mantine/core'
import {
  IconHash,
  IconLayoutKanban,
  IconMessage,
  IconPlus,
  IconSearch,
  IconSettings,
  IconUsersGroup
} from '@tabler/icons-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useAppControlParams from '../../hooks/useAppControlParams'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import Watching from '../../redux/Watching'
import DirectNavLink from '../layouts/DirectNavLink'
import CreateDirect from '../new-message/CreateDirect'
import TeamSetting from '../team-setting/TeamSetting'
import CreateChannel from './channel/CreateChannel'
import CreateGroup from './CreateGroup'

export type TSideBarToggle =
  | 'createBoard'
  | 'createChannel'
  | 'createGroup'
  | 'teamSetting'
  | 'createDirect'
  | 'createGroup'

export default function Sidebar() {
  const { channelId, teamId, directId, boardId, groupId } = useAppParams()
  const { switchTo } = useAppControlParams()
  const path = useLocation()
  const [toggle, setToggle] = useState<TSideBarToggle>()
  const team = useAppSelector(state =>
    Object.values(state.workspace.teams).find(e => e._id === teamId)
  )

  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <div className='flex w-72 flex-col gap-2 py-3'>
        <p className='px-4 text-xl'>{team?.title}</p>
        <div className='flex items-center justify-center gap-2 px-4'>
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
        </div>

        <div className='relative flex-1'>
          <ScrollArea scrollbarSize={6} className='absolute inset-0 px-4'>
            <NavLink
              className='mb-1 p-1'
              label='Boards'
              leftSection={<IconLayoutKanban size='1rem' stroke={1.5} />}
              active={path.pathname.includes('board')}
              defaultOpened={!!boardId}
            >
              <NavLink
                className='mb-2 p-1 pl-3 opacity-70'
                label={`Create channel`}
                rightSection={<IconPlus size={14} />}
                onClick={() => {
                  setToggle('createBoard')
                }}
              />
            </NavLink>

            <NavLink
              className='mb-1 p-1'
              label='Channels'
              leftSection={<IconHash size='1rem' stroke={1.5} />}
              active={path.pathname.includes('channel')}
              defaultOpened={!!channelId}
            >
              <Watching
                watchingFn={state =>
                  Object.values(state.workspace.channels).filter(
                    e =>
                      e.teamId === teamId &&
                      [
                        e.title.toLowerCase(),
                        e.description?.toLowerCase()
                      ].some(e => e?.includes(searchValue.toLowerCase()))
                  )
                }
              >
                {channels => (
                  <>
                    {channels?.map(item => (
                      <NavLink
                        key={item._id}
                        className='p-1 pl-3'
                        label={item.title}
                        active={channelId === item._id}
                        onClick={() => {
                          switchTo({
                            target: 'channel',
                            targetId: item._id
                          })
                        }}
                      />
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

            <NavLink
              className='my-1 p-1'
              label='Groups'
              leftSection={<IconUsersGroup size='1rem' stroke={1.5} />}
              active={!!groupId}
              defaultOpened={!!groupId}
            >
              <Watching
                watchingFn={state =>
                  Object.values(state.workspace.groups).filter(e =>
                    [e.title.toLowerCase(), e.description?.toLowerCase()].some(
                      e => e?.includes(searchValue.toLowerCase())
                    )
                  )
                }
              >
                {groups => (
                  <>
                    {groups?.map(item => (
                      <NavLink
                        key={item._id}
                        className='p-1 pl-3'
                        label={item.title || item._id}
                        active={groupId === item._id}
                        onClick={() => {
                          if (item._id)
                            switchTo({
                              target: 'group',
                              targetId: item._id
                            })
                        }}
                      />
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

            <NavLink
              className='my-1 p-1'
              label='Direct messages'
              leftSection={<IconMessage size='1rem' stroke={1.5} />}
              active={path.pathname.includes('direct-message')}
              defaultOpened={!!directId}
            >
              <Watching
                watchingFn={state => {
                  const meId = state.auth.userInfo?._id
                  const users = Object.values(state.workspace.users)
                  const directs = Object.values(state.workspace.directs).filter(
                    direct => {
                      const user = users.find(
                        user =>
                          direct.userIds.find(e => e !== meId) === user._id
                      )

                      return [
                        user?.email,
                        user?.userName,
                        user?.nickname,
                        direct.title
                      ].some(e => e?.includes(searchValue.toLowerCase()))
                    }
                  )

                  return directs
                }}
              >
                {directs => (
                  <>
                    {directs?.map(item => (
                      <DirectNavLink direct={item} key={item._id}>
                        {({ targetUser }) => (
                          <NavLink
                            key={item._id}
                            className='p-1 pl-3'
                            label={
                              item.title || targetUser?.userName || item._id
                            }
                            active={
                              !!directId &&
                              [
                                item._id,
                                targetUser?._id,
                                targetUser?.userName,
                                targetUser?.email
                              ].includes(directId)
                            }
                            onClick={() => {
                              if (targetUser?.userName)
                                switchTo({
                                  target: 'direct-message',
                                  targetId: targetUser?.userName
                                })
                            }}
                          />
                        )}
                      </DirectNavLink>
                    ))}
                  </>
                )}
              </Watching>

              <NavLink
                className='mb-2 p-1 pl-3 opacity-70'
                label={`Create channel`}
                rightSection={<IconPlus size={14} />}
                onClick={() => {
                  setToggle('createDirect')
                }}
              />
            </NavLink>
          </ScrollArea>
        </div>
      </div>

      <TeamSetting
        isOpen={toggle === 'teamSetting'}
        onClose={() => setToggle(undefined)}
      />

      <CreateDirect
        isOpen={toggle === 'createDirect'}
        onClose={() => setToggle(undefined)}
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
    </>
  )
}
