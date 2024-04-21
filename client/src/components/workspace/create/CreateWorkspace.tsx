import { Button, ScrollArea, Tabs } from '@mantine/core'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import {
  ApiMutationType,
  useAppMutation
} from '../../../services/apis/mutations/useAppMutation'
import { EWorkspaceStatus, EWorkspaceType, extractApi } from '../../../types'
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

export const getDefaultValue = (type: EWorkspaceType) => {
  if (type === EWorkspaceType.Channel) {
    return {
      workspace: {
        type,
        status: EWorkspaceStatus.Public
      }
    }
  }
  if (type === EWorkspaceType.Board) {
    return {
      workspace: {
        type,
        status: EWorkspaceStatus.Public
      }
    }
  }
  if (type === EWorkspaceType.Group) {
    return {
      workspace: {
        type
      }
    }
  }
  if (type === EWorkspaceType.Team) {
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
  const { switchTeam, switchTo } = useAppControlParams()
  const dispatch = useDispatch()

  const { mutateAsync: createBoard } = useAppMutation('createBoard', {
    mutationOptions: {
      onSuccess: data => {
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({ workspaces: [data] })
          )
        )
        switchTo({
          target: EWorkspaceType.Board,
          targetId: data.id
        })
        onClose && onClose()
      }
    }
  })
  const { mutateAsync: createChannel } = useAppMutation('createChannel', {
    mutationOptions: {
      onSuccess: data => {
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({ workspaces: [data] })
          )
        )
        switchTo({
          target: EWorkspaceType.Channel,
          targetId: data.id
        })
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
      onSuccess: data => {
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({ workspaces: [data] })
          )
        )
        switchTeam({ teamId: data.id })
        onClose && onClose()
      }
    }
  })

  return (
    <FormProvider {...form}>
      <Tabs defaultValue='info'>
        <Tabs.List>
          <Tabs.Tab value='info'>Infomation</Tabs.Tab>
          <Tabs.Tab value='members'>Members</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='info'>
          <ScrollArea
            className='absolute inset-0 inset-x-[-12px]'
            classNames={{
              viewport: 'px-3'
            }}
            scrollbarSize={8}
          >
            <CreateWorkspaceInfo />
          </ScrollArea>
        </Tabs.Panel>
        <Tabs.Panel value='members'>
          <ScrollArea
            className='absolute inset-0 inset-x-[-12px]'
            classNames={{
              viewport: 'px-3'
            }}
            scrollbarSize={8}
          >
            {[EWorkspaceType.Channel, EWorkspaceType.Board].includes(
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
        <Button>Close</Button>

        <Button
          onClick={form.handleSubmit(({ ...data }) => {
            if (workspaceType === EWorkspaceType.Team) {
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
                  boards: _data.boards,
                  channels: _data.channels,
                  members: _data.members
                }
              })
            }

            if (workspaceType === EWorkspaceType.Board) {
              const _data = data as ApiMutationType['createBoard']['payload']
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
                  },
                  members: _data.members
                }
              })
            }
            if (workspaceType === EWorkspaceType.Channel) {
              const _data = data as ApiMutationType['createChannel']['payload']
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
                  },
                  members: _data.members
                }
              })
            }

            if (workspaceType === EWorkspaceType.Group) {
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
