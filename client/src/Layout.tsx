import { Divider } from '@mantine/core'
import { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppHeader from './components/layouts/AppHeader'
import Sidebar from './components/layouts/Sidebar'
import TeamList from './components/layouts/TeamList'
import { workspaceActions } from './redux/slices/workspace.slice'
import { useAppQuery } from './services/apis/useAppQuery'
import { TChannel, TGroup, TTeam } from './types/workspace.type'

export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const { data: workspaceData } = useAppQuery({
    key: 'workspace',
    url: {
      baseUrl: '/workspace'
    },
    options: {
      queryKey: ['/workspace']
    }
  })

  useEffect(() => {
    console.log({
      workspaceData
    })
    dispatch(
      workspaceActions.init({
        channels:
          workspaceData?.channels.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as { [channelId: string]: TChannel }
          ) || {},
        groups:
          workspaceData?.groups.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as { [groupId: string]: TGroup }
          ) || {},
        teams:
          workspaceData?.teams.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as { [teamId: string]: TTeam }
          ) || {}
      })
    )
  }, [dispatch, workspaceData])

  return (
    <>
      <div className='flex h-screen w-screen flex-col text-sm'>
        <AppHeader />
        <Divider variant='dashed' />
        <div className='flex flex-1'>
          <TeamList />

          <Divider variant='dashed' orientation='vertical' />
          <div className='flex flex-1'>
            <Sidebar />
            <Divider variant='dashed' orientation='vertical' />
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
