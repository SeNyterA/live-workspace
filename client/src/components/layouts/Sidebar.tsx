import { ActionIcon, Button, Divider, NavLink, ScrollArea } from '@mantine/core'
import {
  IconArrowRight,
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
import CreateDirect from '../new-message/CreateDirect'
import TeamSetting from '../team-setting/TeamSetting'
import DirectNavLink from './DirectNavLink'

export default function Sidebar() {
  const { channelId, teamId, directId, boardId, groupId } = useAppParams()
  const { switchTo } = useAppControlParams()
  const path = useLocation()

  const [toggle, setToggle] = useState<
    | 'createBoard'
    | 'createChannel'
    | 'createGroup'
    | 'teamSetting'
    | 'createDirect'
  >()

  const hasPermission = true

  return (
    <>
      <div className='flex w-72 flex-col gap-2 py-3'>
        <p className='px-4 text-xl'>Team name </p>
        <div className='flex items-center justify-center gap-2 px-4'>
          <Button
            variant='default'
            size='xs'
            className='flex-1'
            leftSection={<IconSearch size={14} />}
            rightSection={<IconArrowRight size={14} />}
          >
            <p>Search on team</p>
          </Button>
          <ActionIcon
            variant='default'
            aria-label='Settings'
            className='h-[30px] w-[30px]'
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
              {hasPermission && (
                <NavLink
                  className='mb-2 p-1 pl-3 opacity-70'
                  label={`Create channel`}
                  rightSection={<IconPlus size={14} />}
                  onClick={() => {
                    setToggle('createBoard')
                  }}
                />
              )}
            </NavLink>
            <NavLink
              className='mb-1 p-1'
              label='Channels'
              leftSection={<IconHash size='1rem' stroke={1.5} />}
              active={path.pathname.includes('channel')}
              defaultOpened={!!channelId}
            >
              <Watching
                watchingFn={state => {
                  try {
                    return Object.values(state.workspace.channels).filter(
                      e => e.teamId === teamId
                    )
                  } catch (error) {
                    console.log(error)
                    return undefined
                  }
                }}
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

              {hasPermission && (
                <NavLink
                  className='mb-2 p-1 pl-3 opacity-70'
                  label={`Create channel`}
                  rightSection={<IconPlus size={14} />}
                  onClick={() => {
                    setToggle('createBoard')
                  }}
                />
              )}
            </NavLink>

            <Divider variant='dashed' />

            <NavLink
              className='my-1 p-1'
              label='Groups'
              leftSection={<IconUsersGroup size='1rem' stroke={1.5} />}
              active={path.pathname.includes('group')}
              defaultOpened={!!groupId}
            >
              {hasPermission && (
                <NavLink
                  className='mb-2 p-1 pl-3 opacity-70'
                  label={`Create channel`}
                  rightSection={<IconPlus size={14} />}
                  onClick={() => {
                    setToggle('createBoard')
                  }}
                />
              )}
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
                  try {
                    return Object.values(state.workspace.directs)
                  } catch (error) {
                    console.log(error)
                    return undefined
                  }
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

              {hasPermission && (
                <NavLink
                  className='mb-2 p-1 pl-3 opacity-70'
                  label={`Create channel`}
                  rightSection={<IconPlus size={14} />}
                  onClick={() => {
                    setToggle('createDirect')
                  }}
                />
              )}
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
    </>
  )
}
