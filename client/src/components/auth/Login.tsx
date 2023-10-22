import { Button, PasswordInput, TextInput } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'

export default function Authentication() {
  const { control, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      terms: false
    }
  })

  console.log(formState)

  const onSubmit = data => {
    if (formState.isDirty) {
      if (formState.dirtyFields.hasOwnProperty('name')) {
        console.log('Register:', data)
      } else {
        console.log('Login:', data)
      }
      reset()
    }
  }

  return (
    <form
      className='h-screen w-screen flex items-center justify-center flex-col gap-3'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-96'>
        <Controller
          control={control}
          name='email'
          render={({ field, fieldState: { invalid } }) => (
            <TextInput
              label='Email'
              placeholder='hello@mantine.dev'
              error={invalid && 'Invalid email'}
              radius='md'
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name='password'
          render={({ field, fieldState: { invalid } }) => (
            <PasswordInput
              label='Password'
              placeholder='Your password'
              error={invalid && 'Password should include at least 6 characters'}
              radius='md'
              {...field}
            />
          )}
        />

        <Controller
          control={control}
          name='name'
          render={({ field, fieldState: { invalid } }) => (
            <TextInput
              label='Name'
              placeholder='Your name'
              error={invalid && 'Name is required'}
              radius='md'
              {...field}
            />
          )}
        />

        <Button variant='default' type='submit' radius='xl'>
          {formState.dirtyFields.hasOwnProperty('name') ? 'Register' : 'Login'}
        </Button>
      </div>
    </form>
  )
}
