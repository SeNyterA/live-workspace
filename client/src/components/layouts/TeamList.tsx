import {
  ActionIcon,
  Avatar,
  Button,
  Divider,
  Drawer,
  ScrollArea,
  Textarea,
  TextInput
} from '@mantine/core'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useAppControlParams from '../../hooks/useAppControlParams'
import useAppParams from '../../hooks/useAppParams'
import userMembers from '../../hooks/userMembers'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { TWorkspacePlayload } from '../../types/workspace.type'

export default function TeamList() {
  const teams =
    useAppSelector(state => Object.values(state.workspace.teams)) || []

  console.log({ teams })
  const { switchTeam } = useAppControlParams()

  const { teamId } = useAppParams()
  const [openDrawer, toggleDrawer] = useState(false)
  const { control, handleSubmit } = useForm<TWorkspacePlayload>()
  const { mutateAsync: createTeam, isPending } = useAppMutation('createTeam')

  userMembers({
    targetId: teamId,
    includeUsers: true
  })

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

      <Drawer.Root
        opened={openDrawer}
        onClose={() => toggleDrawer(false)}
        position='left'
      >
        <Drawer.Overlay color='#000' backgroundOpacity={0.35} blur={15} />
        <Drawer.Content className='rounded-lg p-8'>
          <form
            onSubmit={handleSubmit(data =>
              createTeam({
                url: {
                  baseUrl: '/workspace/teams'
                },
                method: 'post',
                payload: data
              })
            )}
            className='flex h-full w-full flex-col justify-between'
          >
            <div>
              <p className='text-2xl font-semibold'>Create team</p>

              <Controller
                name='title'
                control={control}
                rules={{ required: 'Team name is required' }}
                render={({ field, fieldState }) => (
                  <TextInput
                    label='Name'
                    placeholder='Team name'
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error && fieldState.error.message}
                    radius='md'
                  />
                )}
              />

              <Controller
                name='description'
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field, fieldState }) => (
                  <Textarea
                    label='Description'
                    placeholder='Description for team ...'
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error && fieldState.error.message}
                    radius='md'
                  />
                )}
              />
            </div>
            <div className='flex items-center justify-end gap-3'>
              <Button variant='default' onClick={() => toggleDrawer(false)}>
                Close
              </Button>
              <Button
                variant='filled'
                type='submit'
                color='dark'
                loading={isPending}
              >
                Create
              </Button>
            </div>
          </form>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
