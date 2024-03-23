import { ActionIcon, Avatar, Divider, Drawer, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import useAppControlParams from '../../hooks/useAppControlParams'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import Watching from '../../redux/Watching'
import { EWorkspaceType } from '../../types'
import CreateWorkspace from '../workspace/create/CreateWorkspace'

export default function TeamList() {
  const teams = useAppSelector(state =>
    Object.values(state.workspace.workspaces)
      .filter(team => team.type === 'Team')
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
  )

  const { switchTeam } = useAppControlParams()
  const { teamId } = useAppParams()
  const [openDrawer, toggleDrawer] = useState(false)

  return (
    <>
      <div className='flex h-full w-[56px] flex-col justify-center gap-2 py-2'>
        <ActionIcon
          className={`mx-auto mt-2 flex h-fit w-fit items-center justify-center rounded-full p-0 first:mt-0 ${
            teamId === 'personal' ? 'ring-[1.5px]' : ''
          }`}
          variant='subtle'
          onClick={() => switchTeam({ teamId: 'personal' })}
        >
          <Avatar size={32} />
        </ActionIcon>

        <Divider variant='dashed' className='mx-4' />
        <div className='relative flex-1'>
          <ScrollArea
            className='absolute inset-0'
            scrollbarSize={6}
            classNames={{ viewport: 'py-1 teamlist-viewport' }}
          >
            {teams?.map(team => (
              <ActionIcon
                key={team.id}
                className={`relative mx-auto mt-2 flex h-fit w-fit items-center justify-center p-0 first:mt-0 ${
                  teamId === team.id
                    ? 'rounded-full ring-2 ring-offset-2 ring-blue-400'
                    : 'rounded-full '
                }`}
                variant='light'
                size='md'
                onClick={() => {
                  switchTeam({ teamId: team.id })
                }}
              >
                <Watching
                  watchingFn={state => state.workspace.files[team.avatarId!]}
                >
                  {avatar => (
                    <Avatar
                      radius='sm'
                      size={32}
                      className={teamId === team.id ? 'rounded' : ''}
                      src={avatar?.path}
                    >
                      {team.title?.slice(0, 1)}
                    </Avatar>
                  )}
                </Watching>
              </ActionIcon>
            ))}
          </ScrollArea>
        </div>
        <Divider variant='dashed' className='mx-4' />

        <ActionIcon
          className='m mx-auto flex h-fit w-fit items-center justify-center rounded-full p-0'
          variant='subtle'
          onClick={() => {
            toggleDrawer(true)
          }}
        >
          <Avatar size={32}>
            <IconPlus />
          </Avatar>
        </ActionIcon>
      </div>

      <Drawer
        onClose={() => toggleDrawer(false)}
        opened={openDrawer}
        title={<p className='text-lg font-semibold'>Create team</p>}
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
          onClose={() => toggleDrawer(false)}
          defaultValues={{
            workspace: {
              type: EWorkspaceType.Team
            } as any,
            channels: [{ title: 'General' }, { title: 'Topic' }] as any,
            boards: [{ title: 'Task' }] as any
          }}
        />
      </Drawer>
    </>
  )
}
