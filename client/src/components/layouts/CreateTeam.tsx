import { Checkbox, TextInput, Textarea } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'

export default function TeamForm() {
  const { control, handleSubmit } = useForm()

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='teamName'
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

      <Controller
        name='displayUrl'
        control={control}
        rules={{ required: 'Display URL is required' }}
        render={({ field, fieldState }) => (
          <TextInput
            label='Display URL'
            placeholder='Display URL'
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error && fieldState.error.message}
            radius='md'
          />
        )}
      />

      <Controller
        name='defaultChannel'
        control={control}
        rules={{ required: 'Select at least one channel' }}
        render={({ field }) => (
          <Checkbox.Group
            label='Select default channel'
            value={field.value}
            onChange={field.onChange}
          >
            <Checkbox value='react' label='React' />
            <Checkbox value='svelte' label='Svelte' />
            <Checkbox value='ng' label='Angular' />
            <Checkbox value='vue' label='Vue' />
          </Checkbox.Group>
        )}
      />

      <button type='submit'>Create</button>
    </form>
  )
}
