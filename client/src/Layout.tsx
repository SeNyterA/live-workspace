import { Divider } from '@mantine/core'
import { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppHeader from './components/layouts/AppHeader'
import Sidebar from './components/layouts/Sidebar'
import TeamList from './components/layouts/TeamList'
import {
  TChannels,
  TDirects,
  TGroups,
  TMembers,
  TTeams,
  TUsers,
  workspaceActions
} from './redux/slices/workspace.slice'
import { useAppQuery } from './services/apis/useAppQuery'

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
    const channels = workspaceData?.channels.channels.reduce(
      (pre, next) => ({ ...pre, [next._id]: next }),
      {} as TChannels
    )
    const teams = workspaceData?.teams.teams.reduce(
      (pre, next) => ({ ...pre, [next._id]: next }),
      {} as TTeams
    )
    const directs = workspaceData?.directs.directs.reduce(
      (pre, next) => ({ ...pre, [next._id]: next }),
      {} as TDirects
    )
    const groups = workspaceData?.groups.groups.reduce(
      (pre, next) => ({ ...pre, [next._id]: next }),
      {} as TGroups
    )
    const users = workspaceData?.users.reduce(
      (pre, next) => ({ ...pre, [next._id]: next }),
      {} as TUsers
    )
    const members = [
      ...(workspaceData?.channels.members || []),
      ...(workspaceData?.teams.members || []),
      ...(workspaceData?.groups.members || [])
    ].reduce((pre, next) => ({ ...pre, [next._id]: next }), {} as TMembers)

    console.log({
      channels,
      directs,
      groups,
      members,
      teams,
      users
    })

    dispatch(
      workspaceActions.updateData({
        channels,
        directs,
        groups,
        members,
        teams,
        users
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
