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
import Watching from '../../redux/Watching'
import DirectNavLink from '../layouts/DirectNavLink'
import CreateDirect from '../new-message/CreateDirect'
import TeamSetting from '../team-setting/TeamSetting'
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

  return (
    <>
      <div className='flex w-72 flex-col gap-2 py-3'>
        <p className='px-4 text-xl'>Team name </p>
        <div className='flex items-center justify-center gap-2 px-4'>
          <Input
            className=''
            variant='unstyled'
            size='sm'
            placeholder='Search on workspace'
            leftSection={<IconSearch size={14} />}
            classNames={{
              wrapper:
                'flex h-[30px] flex-1 items-center bg-gray-100 rounded-sm',
              input: 'h-fit'
            }}
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
                    e => e.teamId === teamId
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
                  setToggle('createBoard')
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
                watchingFn={state => Object.values(state.workspace.groups)}
              >
                {groups => (
                  <>
                    {groups?.map(item => (
                      <NavLink
                        key={item._id}
                        className='p-1 pl-3'
                        label={item.title}
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
                watchingFn={state => Object.values(state.workspace.directs)}
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
      />
    </>
  )
}
