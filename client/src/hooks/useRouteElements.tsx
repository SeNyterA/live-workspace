import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useDispatch } from 'react-redux'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Login from '../components/auth/Login'
import Verify from '../components/auth/Verify'
import LandingPage from '../components/landing/LandingPage'
import Layout from '../components/layout/Layout'
import BoardContent from '../components/workspace/board/BoardContent'
import DetailCard from '../components/workspace/board/card/DetailCard'
import MessageContentWrapper from '../components/workspace/message/MessageContentWrapper'
import WorkspaceSetting from '../components/workspace/setting/WorkspaceSetting'
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
    },
    onSucess(user) {
      dispatch(
        authActions.loginSuccess({
          token: lsActions.getToken(),
          user: user
        })
      )
    }
  })

  return isAuthenticated ? (
    <SocketProvider>{user && <Outlet />}</SocketProvider>
  ) : (
    <Navigate to='/auth/login' />
  )
}

function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/team/personal' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: <PublicOnlyRoute />,
      children: [
        {
          path: '/',
          element: <LandingPage />
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
        },

        {
          path: 'auth/verify',
          element: <Verify />
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
            <Layout>
              <Outlet />
              <WorkspaceSetting />
            </Layout>
          ),
          children: [
            {
              path: '',
              element: (
                <div className='flex flex-1 items-center justify-center'>
                  Please choose content...
                </div>
              )
            },
            {
              path: 'board/:boardId',
              element: (
                <>
                  <BoardContent />
                  <Outlet />
                </>
              ),
              children: [
                {
                  path: ':cardId',
                  element: <DetailCard />
                }
              ]
            },
            {
              path: 'channel/:channelId',
              element: <MessageContentWrapper />
            },
            {
              path: 'group/:groupId',
              element: <MessageContentWrapper />
            },
            {
              path: 'direct-message/:directId',
              element: <MessageContentWrapper />
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <Navigate to='/team/personal' />
    }
  ])

  return routeElements
}
