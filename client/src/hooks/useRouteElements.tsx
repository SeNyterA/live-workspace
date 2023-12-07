import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Login from '../components/auth/Login'
import BoardContent from '../components/boards/BoardContent'
import DetailCard from '../components/boards/DetailCard'
import ChannelMessage from '../components/message/ChannelMessage'
import DirectMessage from '../components/message/DirectMessage'
import GroupMessage from '../components/message/GroupMessage'
import Layout from '../Layout'
import { authActions } from '../redux/slices/auth.slice'
import { useAppSelector } from '../redux/store'
import { useAppQuery } from '../services/apis/useAppQuery'
import SocketProvider from '../services/socket/SocketProvider'
import { lsActions } from '../utils/auth'

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
    <Navigate to='/auth/login' />
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
          path: 'auth/login',
          element: <Login />
        },
        {
          path: 'auth/register',
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
          path: 'team/:teamId',
          element: (
            <ErrorBoundary fallback={<></>}>
              <Layout>
                <Outlet />
              </Layout>
            </ErrorBoundary>
          ),
          children: [
            {
              path: 'board/:boardId',
              element: (
                <ErrorBoundary fallback={<></>}>
                  <BoardContent />
                  <Outlet />
                </ErrorBoundary>
              ),
              children: [
                {
                  path: ':cardId',
                  element: (
                    <ErrorBoundary fallback={<></>}>
                      <DetailCard />
                    </ErrorBoundary>
                  )
                }
              ]
            },
            {
              path: 'channel/:channelId',
              element: (
                <ErrorBoundary fallback={<></>}>
                  <ChannelMessage />
                </ErrorBoundary>
              )
            },
            {
              path: 'group/:groupId',
              element: (
                <ErrorBoundary fallback={<></>}>
                  <GroupMessage />
                </ErrorBoundary>
              )
            },
            {
              path: 'direct-message/:directId',
              element: (
                <ErrorBoundary fallback={<></>}>
                  <DirectMessage />
                </ErrorBoundary>
              )
            }
          ]
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
