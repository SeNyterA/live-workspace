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
import useAppParams from '../../hooks/useAppParams'
import useControlParams from '../../hooks/useControlParams'
import { useAppSelector } from '../../redux/store'
import { EMemberRole } from '../../types/workspace.type'
import TeamSetting from '../team-setting/TeamSetting'

export default function Sidebar() {
  const { channelId, teamId } = useAppParams()
  const { switchTo } = useControlParams()
  const path = useLocation()

  const [toggle, setToggle] = useState<
    'createBoard' | 'createChannel' | 'createGroup' | 'teamSetting'
  >()

  const hasPermission = useAppSelector(
    state =>
      !!Object.values(state.workspace.members).find(member => {
        return (
          member.targetId === teamId &&
          member.isAvailable &&
          member.userId === state.auth.userInfo?._id &&
          [EMemberRole.Admin, EMemberRole.Owner].includes(member.role)
        )
      })
  )

  const channels =
    useAppSelector(state =>
      Object.values(state.workspace.channels).filter(e => e.teamId === teamId)
    ) || []

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
            >
              {channels.map(item => (
                <NavLink
                  key={item._id}
                  className='p-1 pl-3'
                  label={item.title}
                  active={channelId === item._id}
                  onClick={() => {
                    switchTo({
                      target: 'board',
                      targetId: item._id
                    })
                  }}
                />
              ))}

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
            >
              {channels.map(item => (
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
            >
              {channels.map(item => (
                <NavLink
                  key={item._id}
                  className='p-1 pl-3'
                  label={item.title}
                  active={channelId === item._id}
                  onClick={() => {
                    switchTo({
                      target: 'group',
                      targetId: item._id
                    })
                  }}
                />
              ))}

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
            >
              {channels.map(item => (
                <NavLink
                  key={item._id}
                  className='p-1 pl-3'
                  label={item.title}
                  active={channelId === item._id}
                  onClick={() => {
                    switchTo({
                      target: 'direct-message',
                      targetId: item._id
                    })
                  }}
                />
              ))}

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
          </ScrollArea>
        </div>
      </div>

      <TeamSetting
        isOpen={toggle === 'teamSetting'}
        onClose={() => setToggle(undefined)}
      />
    </>
  )
}
