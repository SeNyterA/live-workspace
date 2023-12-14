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

type TForm = ApiMutationType['createBoard']['payload']

export default function CreateBoard({
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
  const { mutateAsync: createBoard, isPending } = useAppMutation('createBoard')

  useEffect(() => {
    reset()
  }, [refetchKey])

  return (
    <Drawer
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create board</p>}
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
            label='Board Name'
            placeholder='Enter the board name'
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
            label='Board Description'
            description='Description for the board'
            placeholder='Enter a description for the board...'
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
                description: 'Type to search and add members to the board',
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
              createBoard({
                url: {
                  baseUrl: '/workspace/teams/:teamId/boards',
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
