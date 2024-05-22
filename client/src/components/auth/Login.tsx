import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  PasswordInput,
  TextInput
} from '@mantine/core'
import { signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BsGoogle } from 'react-icons/bs'
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

  const { mutateAsync: login } = useAppMutation('login', {
    mutationOptions: {
      onSuccess(data) {
        dispatch(authActions.loginSuccess(data))
      }
    }
  })
  const { mutateAsync: loginWithSocial } = useAppMutation('loginWithSocial', {
    mutationOptions: {
      onSuccess(data) {
        dispatch(authActions.loginSuccess(data))
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
    <div className='w-full rounded-2xl p-4'>
      <p className='my-4 text-center text-2xl font-semibold'>
        Welcome to Live Workspace
      </p>
      <Button
        className='w-full'
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
        <BsGoogle radius='xl' className='mr-3' /> Continue with Google
      </Button>

      <Divider label='Or continue with email' labelPosition='center' my='lg' />

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
        <div className='space-y-4'>
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
        </div>

        <div className='mt-6 flex w-full items-center justify-between'>
          <div
            onClick={() => {
              setType(type === 'login' ? 'register' : 'login')
            }}
            className='text-sm'
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </div>
          <Button type='submit' radius='xl'>
            {type}
          </Button>
        </div>
      </form>
    </div>
  )
}
