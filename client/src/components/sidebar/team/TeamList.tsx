import { ActionIcon, Avatar, Divider, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
// import { WorkspaceType } from '../../../new-types/workspace'
import { useAppSelector } from '../../../redux/store'
import CreateTeam from './CreateTeam'

export default function TeamList() {
  const teams = useAppSelector(state =>
    Object.values(state.workspace.workspaces).filter(
      team => team.type === 'Team'
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
                key={team._id}
                className={`mx-auto mt-2 flex h-fit w-fit items-center justify-center rounded-full p-0 first:mt-0 ${
                  teamId === team._id ? 'ring-[1.5px]' : ''
                }`}
                variant='light'
                size='md'
                onClick={() => {
                  switchTeam({ teamId: team._id })
                }}
              >
                <Avatar size={32} />
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

      <CreateTeam
        isOpen={openDrawer}
        onClose={() => toggleDrawer(false)}
        defaultValues={{
          channels: [{ title: 'Genaral' }, { title: 'Topic' }]
        }}
      />
    </>
  )
}
