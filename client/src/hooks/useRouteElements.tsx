import { useEffect } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Layout from '../Layout'
import SocketProvider from '../SocketProvider'
import MessageContent from '../components/MessageContent'
import Login from '../components/auth/Login'
import BoardContent from '../components/boards/BoardContent'
import { useAppSelector } from '../redux/store'
import { useAppQuery } from '../services/apis/useAppQuery'

export const paths = {
  login: '/login',
  register: '/register',

  board: 'board/:boardId',
  channel: 'channel/:channelId',
  group: 'group/:groupId',
  message: 'direct-message/:messageId'
}

function PrivateRoute() {
  useEffect(() => {
    console.log({ sssss: 'ssssssssss' })
  }, [])

  const { data } = useAppQuery({
    key: 'login',
    url: {
      baseUrl: '/auth/profile'
    }
  })

  console.log(data)

  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  return isAuthenticated ? (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  ) : (
    <Navigate to='/login' />
  )
}

function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: <PublicOnlyRoute />,
      children: [
        {
          path: '/',
          element: (
            <div className='h-screen w-screen flex items-center justify-center'>
              Lading page
            </div>
          )
        },
        {
          path: paths.login,
          element: <Login />
        },
        {
          path: paths.register,
          element: (
            <div className='h-screen w-screen flex items-center justify-center'>
              Register
            </div>
          )
        }
      ]
    },
    {
      path: '/',
      element: <PrivateRoute />,
      children: [
        {
          path: paths.board,
          element: (
            <Layout>
              <BoardContent />
            </Layout>
          )
        },
        {
          path: paths.channel,
          element: (
            <Layout>
              <MessageContent />
            </Layout>
          )
        },
        {
          path: paths.group,
          element: (
            <Layout>
              <MessageContent />
            </Layout>
          )
        },
        {
          path: paths.message,
          element: (
            <Layout>
              <MessageContent />
            </Layout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <div className='h-screen w-screen flex items-center justify-center'>
          Not found
        </div>
      )
    }
  ])

  return routeElements
}
