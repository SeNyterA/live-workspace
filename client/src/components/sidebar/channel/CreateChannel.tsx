import { Button, Drawer, ScrollArea, Textarea, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useAppParams from '../../../hooks/useAppParams'
import {
  ApiMutationType,
  useAppMutation
} from '../../../services/apis/useAppMutation'
import { EMemberRole } from '../../../types/workspace.type'
import MemberControl from '../MemberControl'
import UserCombobox from '../UserCombobox'

type TForm = ApiMutationType['createChannel']['payload']

export default function CreateChannel({
  onClose,
  isOpen,
  refetchKey
}: {
  isOpen: boolean
  onClose: () => void
  refetchKey?: string
}) {
  const { teamId } = useAppParams()
  const { control, handleSubmit, reset } = useForm<TForm>({})
  const { mutateAsync: createChannel, isPending } =
    useAppMutation('createChannel')

  useEffect(() => {
    reset()
  }, [refetchKey])

  return (
    <Drawer
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create Channel</p>}
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
            label='Channel Name'
            placeholder='Enter the channel name'
            description='Leave it blank to use the default name...'
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
            label='Channel Description'
            description='Description for the channel'
            placeholder='Enter a description for the channel...'
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
                label: 'Add Members',
                description: 'Type to search and add members to the channel',
                placeholder: 'Search and select members...',
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
        <Button variant='default' color='red'>
          Close
        </Button>

        <Button
          loading={isPending}
          disabled={isPending}
          onClick={handleSubmit(data => {
            if (data && teamId)
              createChannel({
                url: {
                  baseUrl: '/workspace/teams/:teamId/channels',
                  urlParams: {
                    teamId
                  }
                },
                method: 'post',
                payload: data
              }).then(() => {
                onClose()
              })
          })}
        >
          Create
        </Button>
      </div>
    </Drawer>
  )
}
