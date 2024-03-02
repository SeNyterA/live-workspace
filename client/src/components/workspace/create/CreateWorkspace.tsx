import { Button, ScrollArea, Tabs } from '@mantine/core'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import useAppParams from '../../../hooks/useAppParams'
import {
  ApiMutationType,
  useAppMutation
} from '../../../services/apis/mutations/useAppMutation'
import { EWorkspaceStatus, WorkspaceType } from '../../../types'
import CreateWorkspaceInfo from './CreateWorkspaceInfo'
import Members from './Members'
import { TeamUsers } from './TeamUsers'

export type TCreateWorkspaceForm =
  | ApiMutationType['createBoard']['payload']
  | ApiMutationType['createChannel']['payload']
  | ApiMutationType['createGroup']['payload']
  | ApiMutationType['createTeam']['payload']

export const useCreateWorkspaceForm = () => {
  return useFormContext<TCreateWorkspaceForm>()
}

export const getDefaultValue = (type: WorkspaceType) => {
  if (type === WorkspaceType.Channel) {
    return {
      workspace: {
        type,
        status: EWorkspaceStatus.Public
      }
    }
  }
  if (type === WorkspaceType.Board) {
    return {
      workspace: {
        type,
        status: EWorkspaceStatus.Public
      }
    }
  }
  if (type === WorkspaceType.Group) {
    return {
      workspace: {
        type
      }
    }
  }
  if (type === WorkspaceType.Team) {
    return {
      workspace: {
        type
      },
      channels: [{ title: 'General' }, { title: 'Topic' }],
      boards: [{ title: 'Tasks' }, { title: 'Daily report' }]
    }
  }
}
export default function CreateWorkspace({
  defaultValues,
  onClose
}: {
  defaultValues?: TCreateWorkspaceForm
  onClose: () => void
}) {
  const form = useForm<TCreateWorkspaceForm>({ defaultValues })
  const workspaceType = defaultValues?.workspace.type
  const { teamId } = useAppParams()

  const { mutateAsync: createBoard } = useAppMutation('createBoard', {
    mutationOptions: {
      onSuccess: () => {
        onClose && onClose()
      }
    }
  })
  const { mutateAsync: createChannel } = useAppMutation('createChannel', {
    mutationOptions: {
      onSuccess: () => {
        onClose && onClose()
      }
    }
  })
  const { mutateAsync: createGroup } = useAppMutation('createGroup', {
    mutationOptions: {
      onSuccess: () => {
        onClose && onClose()
      }
    }
  })
  const { mutateAsync: createTeam } = useAppMutation('createTeam', {
    mutationOptions: {
      onSuccess: () => {
        onClose && onClose()
      }
    }
  })

  return (
    <FormProvider {...form}>
      <Tabs
        defaultValue='info'
        classNames={{
          root: 'h-full flex flex-col',
          panel: 'flex-1'
        }}
      >
        <Tabs.List>
          <Tabs.Tab value='info'>Infomation</Tabs.Tab>
          <Tabs.Tab value='members'>Members</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='info' className='relative'>
          <ScrollArea
            className='absolute inset-0 right-[-12px] pr-3'
            scrollbarSize={8}
          >
            <CreateWorkspaceInfo />
          </ScrollArea>
        </Tabs.Panel>
        <Tabs.Panel value='members' className='relative'>
          <ScrollArea
            className='absolute inset-0 right-[-12px] pr-3'
            scrollbarSize={8}
          >
            {[WorkspaceType.Channel, WorkspaceType.Board].includes(
              workspaceType!
            ) ? (
              <TeamUsers />
            ) : (
              <Members />
            )}
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>

      <div className='mt-4 flex items-center justify-end gap-3'>
        <Button variant='default' color='red'>
          Close
        </Button>

        <Button
          onClick={form.handleSubmit(({ ...data }) => {
            console.log({ data })

            if (workspaceType === WorkspaceType.Team) {
              const _data = data as ApiMutationType['createTeam']['payload']
              createTeam({
                url: {
                  baseUrl: '/teams'
                },
                method: 'post',
                payload: {
                  workspace: {
                    ...data.workspace,
                    type: workspaceType
                  },
                  boards: _data?.boards,
                  channels: _data?.channels,
                  members: _data.members
                }
              })
            }

            if (workspaceType === WorkspaceType.Board) {
              createBoard({
                url: {
                  baseUrl: '/teams/:teamId/boards',
                  urlParams: {
                    teamId: teamId!
                  }
                },
                method: 'post',
                payload: {
                  workspace: {
                    ...data.workspace,
                    type: workspaceType
                  }
                }
              })
            }
            if (workspaceType === WorkspaceType.Channel) {
              createChannel({
                url: {
                  baseUrl: '/teams/:teamId/channels',
                  urlParams: {
                    teamId: teamId!
                  }
                },
                method: 'post',
                payload: {
                  workspace: {
                    ...data.workspace,
                    type: workspaceType
                  }
                }
              })
            }

            if (workspaceType === WorkspaceType.Group) {
              createGroup({
                url: {
                  baseUrl: '/groups'
                },
                method: 'post',
                payload: {
                  workspace: {
                    ...data.workspace,
                    type: workspaceType
                  },
                  members: data.members
                }
              })
            }
          })}
        >
          Create
        </Button>
      </div>
    </FormProvider>
  )
}
