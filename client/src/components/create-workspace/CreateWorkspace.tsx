import { Button, ScrollArea, Tabs } from '@mantine/core'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { ApiMutationType } from '../../services/apis/mutations/useAppMutation'
import { WorkspaceType } from '../../types'
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
export default function CreateWorkspace({
  defaultValues
}: {
  defaultValues: TCreateWorkspaceForm
}) {
  const form = useForm<TCreateWorkspaceForm>({ defaultValues })
  const workspaceType = defaultValues.workspace.type

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
              workspaceType
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
          })}
        >
          Create
        </Button>
      </div>
    </FormProvider>
  )
}
