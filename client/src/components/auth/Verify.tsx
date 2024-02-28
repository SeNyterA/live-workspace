import { useEffect } from 'react'
import useAppQueryParams from '../../hooks/useAppQueryParams'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'

export default function Verify() {
  const { token } = useAppQueryParams<{ token: string }>()
  const { mutateAsync: verify } = useAppMutation('verify')

  useEffect(() => {
    if (!token) return
    verify({
      url: { baseUrl: '/auth/verify' },
      payload: {
        token: token
      },
      method: 'post'
    })
  }, [token])

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      Verifying account...
    </div>
  )
}
