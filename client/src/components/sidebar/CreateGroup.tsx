import { Button, Drawer, ScrollArea, Textarea, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../hooks/useAppControlParams'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import {
  ApiMutationType,
  useAppMutation
} from '../../services/apis/mutations/useAppMutation'
import { EMemberRole } from '../../types/workspace.type'
import MemberControl from './MemberControl'
import UserCombobox from './UserCombobox'

type TForm = ApiMutationType['createGroup']['payload']

export default function CreateGroup({
  onClose,
  isOpen,
  refetchKey
}: {
  isOpen: boolean
  onClose: () => void
  refetchKey?: string
}) {
  const { control, handleSubmit, reset } = useForm<TForm>()
  const { mutateAsync: createGroup, isPending } = useAppMutation('createGroup')
  const { switchTo } = useAppControlParams()
  const dispatch = useDispatch()
  useEffect(() => {
    reset()
  }, [refetchKey])

  return (
    <Drawer
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create group</p>}
      overlayProps={{
        color: '#000',
        backgroundOpacity: 0.2,
        blur: 0.5
      }}
      classNames={{
        content: 'rounded-lg flex flex-col',
        inner: 'p-3',
        body: 'flex flex-col flex-1'
      }}
    >
      <Controller
        control={control}
        name='workspace.title'
        render={({ field: { value, onChange } }) => (
          <TextInput
            data-autofocus
            label='Group name'
            placeholder='Your name'
            description='Leave it blank to use the names of the group members...'
            size='sm'
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        )}
      />

      <Controller
        control={control}
        name='workspace.displayUrl'
        rules={{
          required: 'Display name is required'
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <TextInput
            data-autofocus
            withAsterisk
            label='Dispay url'
            placeholder='Enter the display url'
            description='This is the url that will be used to access the team. e.g. .../teams/your-team-name'
            size='sm'
            className='mt-2'
            value={value}
            onChange={e => onChange(e.target.value)}
            error={fieldState.error && fieldState.error.message}
          />
        )}
      />

      <Controller
        control={control}
        name='workspace.description'
        render={({ field: { value, onChange } }) => (
          <Textarea
            label='Group description'
            description='Description for the group'
            placeholder='Anything...'
            className='mt-2'
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        )}
      />

      <Controller
        control={control}
        name='members'
        render={({ field: { value, onChange } }) => (
          <>
            <UserCombobox
              usersSelectedId={value?.map(e => e.userId) || []}
              onPick={userId => {
                const member = value?.find(e => e.userId === userId)
                if (!member) {
                  onChange([
                    ...(value || []),
                    {
                      userId,
                      role: EMemberRole.Member
                    }
                  ])
                } else {
                  onChange((value || []).filter(e => e.userId !== userId))
                }
              }}
              textInputProps={{
                label: 'Group description',
                description: 'Description for the group',
                placeholder: 'Anything...',
                className: 'mt-2'
              }}
            />

            <div className='relative flex-1'>
              <ScrollArea className='absolute inset-0 mt-2' scrollbarSize={8}>
                {value?.map((member, index) => (
                  <MemberControl
                    member={member}
                    key={member.userId}
                    onChange={role => {
                      onChange(
                        value.map((e, _index) => ({
                          ...e,
                          ...(index === _index && { role: role })
                        }))
                      )
                    }}
                    onRemove={() => {
                      onChange(value.filter((_, _index) => index !== _index))
                    }}
                  />
                ))}
              </ScrollArea>
            </div>
          </>
        )}
      />

      <div className='mt-2 flex items-center justify-end gap-3'>
        <Button variant='default' color='red' onClick={onClose}>
          Close
        </Button>

        <Button
          loading={isPending}
          disabled={isPending}
          onClick={handleSubmit(data => {
            Array(100)
              .fill(0)
              .forEach(() => {
                createGroup(
                  {
                    url: {
                      baseUrl: '/groups'
                    },
                    method: 'post',
                    payload: {
                      workspace: {
                        title: data.workspace.title,
                        displayUrl: data.workspace.displayUrl,
                        description: data.workspace.description
                      } as any,
                      members: data.members
                    }
                  },
                  {
                    onSuccess(data, variables, context) {
                      dispatch(
                        workspaceActions.updateData({
                          workspaces: { [data.group._id]: data.group }
                        })
                      )
                      switchTo({ target: 'group', targetId: data.group._id })
                      onClose()
                    }
                  }
                )
              })
          })}
        >
          Create
        </Button>
      </div>
    </Drawer>
  )
}
