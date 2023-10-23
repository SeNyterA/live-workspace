import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { authActions } from '../../redux/slices/auth.slice'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { TUser } from '../../types/user.type'

type TAuthForm = Pick<TUser, 'email' | 'password' | 'userName'> & {
  terms: boolean
}

export default function Authentication() {
  const [type, setType] = useState<'register' | 'login'>('login')
  const { mutateAsync } = useAppMutation('login')

  const dispatch = useDispatch()

  const { control, handleSubmit, formState, reset } = useForm<TAuthForm>({
    defaultValues: {
      terms: false
    }
  })

  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <Paper radius='md' className='w-96' p='xl' withBorder>
        <Text size='lg' fw={500}>
          Welcome to Mantine, {type} with
        </Text>

        <Group grow mb='md' mt='md'>
          <BsGoogle radius='xl'>Google</BsGoogle>
          <BsGithub radius='xl'>Github</BsGithub>
        </Group>

        <Divider
          label='Or continue with email'
          labelPosition='center'
          my='lg'
        />

        <form
          onSubmit={handleSubmit(data => {
            if (formState.isDirty) {
              if (formState.dirtyFields.hasOwnProperty('name')) {
                console.log('Register:', data)
              } else {
                console.log('Login:', data)

                mutateAsync(
                  {
                    method: 'post',
                    url: {
                      baseUrl: '/auth/login'
                    },
                    payload: {
                      userNameOrEmail: 'senytera@gmail.com',
                      password: '123123'
                    }
                  },
                  {
                    onSuccess(data) {
                      dispatch(authActions.loginSuccess(data))
                    }
                  }
                )
              }
              reset()
            }
          })}
        >
          <Stack>
            {type === 'register' && (
              <Controller
                name='userName'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextInput
                    label='Name'
                    placeholder='Your name'
                    value={field.value}
                    onChange={field.onChange}
                    radius='md'
                  />
                )}
              />
            )}

            <Controller
              name='email'
              control={control}
              render={({ field, fieldState }) => (
                <TextInput
                  label='Email'
                  placeholder='hello@mantine.dev'
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error && 'Invalid email'}
                  radius='md'
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              render={({ field, fieldState }) => (
                <PasswordInput
                  label='Password'
                  placeholder='Your password'
                  value={field.value}
                  onChange={field.onChange}
                  error={
                    fieldState.error &&
                    'Password should include at least 6 characters'
                  }
                  radius='md'
                />
              )}
            />

            {type === 'register' && (
              <Controller
                name='terms'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label='I accept terms and conditions'
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            )}
          </Stack>

          <Group justify='space-between' mt='xl'>
            <Anchor
              component='button'
              type='button'
              c='dimmed'
              onClick={() => {
                setType(type === 'login' ? 'register' : 'login')
              }}
              size='xs'
            >
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type='submit' radius='xl' variant='outline'>
              {type}
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  )
}
