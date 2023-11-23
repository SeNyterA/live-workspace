import { Button, Drawer, ScrollArea, Textarea, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ApiMutationType,
  useAppMutation
} from '../../services/apis/useAppMutation'
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
        name='title'
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
        name='description'
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
        <Button
          variant='default'
          color='red'
          onClick={onClose}
          loading={isPending}
          disabled={isPending}
        >
          Close
        </Button>

        <Button
          onClick={handleSubmit(data => {
            createGroup({
              url: {
                baseUrl: '/workspace/groups'
              },
              method: 'post',
              payload: data
            })
          })}
        >
          Create
        </Button>
      </div>
    </Drawer>
  )
}
