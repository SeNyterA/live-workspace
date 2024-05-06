import { useDispatch } from 'react-redux'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { authActions } from '../../redux/slices/auth.slice'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'
import SocketProvider from '../../services/socket/SocketProvider'
import { extractApi } from '../../types'
import { lsActions } from '../../utils/auth'
import Login from '../auth/Login'
import Verify from '../auth/Verify'
import Layout from '../layout/Layout'
import LandingPage from '../portfolio/Portfolio'
import BoardContent from '../workspace/board/BoardContent'
import DetailCard from '../workspace/board/card/DetailCard'
import MessageContentWrapper from '../workspace/message/MessageContentWrapper'
import WorkspaceSetting from '../workspace/setting/WorkspaceSetting'
import { WorkspaceLading } from '../landing/WorkspaceLading'

function PrivateRoute() {
  const dispatch = useDispatch()
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  const { data: user } = useAppQuery({
    key: 'login',
    url: {
      baseUrl: '/auth/profile'
    },
    onSuccess(user) {
      dispatch(
        authActions.loginSuccess({
          token: lsActions.getToken(),
          user: user
        })
      )
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            users: [user]
          })
        )
      )
    }
  })

  return isAuthenticated ? (
    <SocketProvider>{user && <Outlet />}</SocketProvider>
  ) : (
    <Navigate
      to={`/auth/login?redirect=${location.pathname + location.search}`}
    />
  )
}

function PublicOnlyRoute() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={
        new URLSearchParams(location.search).get('redirect') || '/team/personal'
      }
    />
  )
}

export const routers = createBrowserRouter([
  {
    path: '/',
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/',
        element: <WorkspaceLading />
      },

      {
        path: 'portfolio',
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
