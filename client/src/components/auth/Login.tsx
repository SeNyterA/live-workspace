import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from '@mantine/core'
import { signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../../firebase/firebase'
import { authActions } from '../../redux/slices/auth.slice'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'
import { TUser } from '../../types'

type TAuthForm = Pick<TUser, 'email' | 'userName'> & {
  terms: boolean
  password: string
}

export default function Authentication() {
  const [type, setType] = useState<'register' | 'login'>('login')
  const navigate = useNavigate()
  // const { redirect } = useAppQueryParams<{ redirect: string }>()
  const { mutateAsync: login } = useAppMutation('login', {
    mutationOptions: {
      onSuccess(data) {
        dispatch(authActions.loginSuccess(data))
        // const redirect = new URLSearchParams(location.search).get('redirect')
        // console.log(redirect)
        // navigate(redirect || '/')
      }
    }
  })
  const { mutateAsync: loginWithSocial } = useAppMutation('loginWithSocial', {
    mutationOptions: {
      onSuccess(data) {
        dispatch(authActions.loginSuccess(data))
        // const redirect = new URLSearchParams(location.search).get('redirect')
        // console.log(redirect)
        // navigate(redirect || '/')
      }
    }
  })
  const { mutateAsync: register } = useAppMutation('register')
  const dispatch = useDispatch()

  const { control, handleSubmit } = useForm<TAuthForm>({
    defaultValues: {
      terms: false
    }
  })

  return (
    <div className='relative flex h-screen w-screen items-center bg-[url(/auth-bg.jpg)] bg-cover bg-center bg-no-repeat'>
      <div className='m-10 '>
        <p className='text-[60px] font-bold'>Live workspace</p>
        <p className='text-[30px] font-light'>Collaborate with your team</p>
        <p className='text-[20px] font-light'>
          Create, share and manage your projects
        </p>
      </div>
      <div className='absolute inset-10 left-[unset] w-96 rounded-xl p-6 '>
        <Text size='lg' fw={500}>
          Welcome to Mantine, {type === 'register' ? 'Register' : 'Login'} with
        </Text>

        <Group grow mb='md' mt='md'>
          <ActionIcon
            variant='transparent'
            onClick={() => {
              signInWithPopup(auth, googleProvider)
                .then(async result => {
                  const token = await result.user.getIdToken()
                  loginWithSocial({
                    url: { baseUrl: '/auth/loginWithSocial' },
                    method: 'post',
                    payload: { token }
                  })
                })
                .catch(error => {})
            }}
          >
            <BsGoogle radius='xl'>Google</BsGoogle>
          </ActionIcon>
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
              login({
                method: 'post',
                url: {
                  baseUrl: '/auth/login'
                },
                payload: {
                  userNameOrEmail: data.email,
                  password: data.password
                }
              })
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
                    // dispatch(authActions.loginSuccess(data))
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
                    classNames={{
                      input: ' '
                    }}
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
                  classNames={{
                    input: ' '
                  }}
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
                  classNames={{
                    input: ' '
                  }}
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
            <Button type='submit' radius='xl'>
              {type}
            </Button>
          </Group>
        </form>
      </div>
    </div>
  )
}
