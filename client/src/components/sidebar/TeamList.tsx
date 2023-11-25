import { ActionIcon, Avatar, Divider, ScrollArea } from '@mantine/core'
import { useState } from 'react'
import useAppControlParams from '../../hooks/useAppControlParams'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import CreateTeam from './CreateTeam'

export default function TeamList() {
  const teams =
    useAppSelector(state => Object.values(state.workspace.teams)) || []

  const { switchTeam } = useAppControlParams()
  const { teamId } = useAppParams()
  const [openDrawer, toggleDrawer] = useState(false)

  return (
    <>
      <div className='flex h-full w-[56px] flex-col justify-center gap-2 py-2'>
        <ActionIcon
          className='mx-2 flex h-fit w-fit items-center justify-center rounded-full p-0'
          variant='subtle'
        >
          <Avatar />
        </ActionIcon>

        <Divider variant='dashed' className='mx-4' />
        <div className='relative flex-1'>
          <ScrollArea className='absolute inset-0 px-2' scrollbarSize={6}>
            {teams.map(team => (
              <ActionIcon
                key={team._id}
                className={`mt-1 flex h-fit w-fit items-center justify-center rounded-full p-0 first:mt-0 ${
                  teamId === team._id && '!rounded-lg bg-blue-50'
                }`}
                variant='subtle'
                onClick={() => {
                  console.log(team)
                  switchTeam({ teamId: team._id })
                }}
              >
                <Avatar
                  className={`${
                    teamId === team._id && '!rounded-lg bg-blue-50'
                  }`}
                />
              </ActionIcon>
            ))}
          </ScrollArea>
        </div>
        <Divider variant='dashed' className='mx-4' />

        <ActionIcon
          className='mx-2 flex h-fit w-fit items-center justify-center rounded-full p-0'
          variant='subtle'
          onClick={() => {
            toggleDrawer(true)
          }}
        >
          <Avatar />
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
