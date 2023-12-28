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
  const { mutateAsync: login } = useAppMutation('login')
  const { mutateAsync: register } = useAppMutation('register')
  const dispatch = useDispatch()

  const { control, handleSubmit } = useForm<TAuthForm>({
    defaultValues: {
      terms: false
    }
  })

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <Paper radius='md' className='w-96' p='xl' withBorder>
        <Text size='lg' fw={500}>
          Welcome to Mantine, {type === 'register' ? 'Register' : 'Login'} with
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
            if (type === 'login') {
              login(
                {
                  method: 'post',
                  url: {
                    baseUrl: '/auth/login'
                  },
                  payload: {
                    userNameOrEmail: data.email,
                    password: data.password
                  }
                },
                {
                  onSuccess(data) {
                    dispatch(authActions.loginSuccess(data))
                  }
                }
              )
            }

            if (type === 'register') {
              register(
                {
                  method: 'post',
                  url: {
                    baseUrl: '/auth/register'
                  },
                  payload: {
                    ...data
                  }
                },
                {
                  onSuccess(data) {
                    dispatch(authActions.loginSuccess(data))
                  }
                }
              )
            }
          })}
        >
          <Stack>
            {type === 'register' && (
              <Controller
                name='userName'
                control={control}
                rules={{ required: 'User name is required' }}
                render={({ field, fieldState }) => (
                  <TextInput
                    label='Name'
                    placeholder='Your name'
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error && fieldState.error.message}
                    radius='md'
                  />
                )}
              />
            )}

            <Controller
              name='email'
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  label='Email'
                  placeholder='hello@mantine.dev'
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error && fieldState.error.message}
                  radius='md'
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password should be at least 6 characters long'
                }
              }}
              render={({ field, fieldState }) => (
                <PasswordInput
                  label='Password'
                  placeholder='Your password'
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error && fieldState.error.message}
                  radius='md'
                />
              )}
            />

            {type === 'register' && (
              <Controller
                name='terms'
                control={control}
                rules={{
                  required: 'You must accept the terms and conditions'
                }}
                render={({ field, fieldState }) => (
                  <Checkbox
                    label='I accept terms and conditions'
                    checked={field.value}
                    onChange={field.onChange}
                    error={fieldState.error && fieldState.error.message}
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
