import {
  Button,
  CloseButton,
  MultiSelect,
  Textarea,
  TextInput
} from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import useAppParams from '../../hooks/useAppParams'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { TChannelPayload } from '../../types/workspace.type'

export default function ChannelForm() {
  const { teamId } = useAppParams()
  const { control, handleSubmit } = useForm<TChannelPayload>()
  const { mutateAsync: createChannel, isPending } =
    useAppMutation('createChannel')
  return (
    <form
      onSubmit={handleSubmit(data =>
        createChannel({
          url: {
            baseUrl: '/workspace/teams/:teamId/channels',
            urlParams: {
              teamId: teamId!
            }
          },
          method: 'post',
          payload: data
        })
      )}
      className='flex flex-col gap-3'
    >
      <div className='flex items-center justify-center'>
        <p className='flex-1 text-lg font-semibold'>Create channel</p>
        <CloseButton />
      </div>
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

      <MultiSelect
        label='Your favorite libraries'
        placeholder='Pick value'
        data={['React', 'Angular', 'Vue', 'Svelte']}
        searchable
      />

      <div className='flex items-center justify-end gap-3'>
        <Button variant='default'>Close</Button>
        <Button variant='filled' type='submit' color='dark' loading={isPending}>
          Create
        </Button>
      </div>
    </form>
  )
}
