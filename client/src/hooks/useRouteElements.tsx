import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Layout from '../Layout'
import SocketProvider from '../services/socket/SocketProvider'
import MessageContent from '../components/MessageContent'
import Login from '../components/auth/Login'
import BoardContent from '../components/boards/BoardContent'
import { authActions } from '../redux/slices/auth.slice'
import { useAppSelector } from '../redux/store'
import { useAppQuery } from '../services/apis/useAppQuery'
import { lsActions } from '../utils/auth'

export const paths = {
  login: 'auth/login',
  register: 'auth/register',

  team: 'team/:teamId',
  board: 'team/:teamId/board/:boardId',
  channel: 'team/:teamId/channel/:channelId',
  group: 'team/:teamId/group/:groupId',
  message: 'team/:teamId/direct-message/:messageId'
}

function PrivateRoute() {
  const dispatch = useDispatch()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

  const { data: user } = useAppQuery({
    key: 'login',
    url: {
      baseUrl: '/auth/profile'
    }
  })

  useEffect(() => {
    if (user)
      dispatch(
        authActions.loginSuccess({
          token: lsActions.getToken(),
          user: user
        })
      )
  }, [user, dispatch])

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
            <div className='flex h-screen w-screen items-center justify-center'>
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
            <div className='flex h-screen w-screen items-center justify-center'>
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
          path: paths.team,
          element: (
            <Layout>
              <></>
            </Layout>
          )
        },
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
        <div className='flex h-screen w-screen items-center justify-center'>
          Not found
        </div>
      )
    }
  ])

  return routeElements
}
