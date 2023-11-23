import { Divider, LoadingOverlay } from '@mantine/core'
import { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppHeader from './components/layouts/AppHeader'
import Sidebar from './components/sidebar/Sidebar'
import TeamList from './components/sidebar/TeamList'
import { TMembers, workspaceActions } from './redux/slices/workspace.slice'
import { useAppQuery } from './services/apis/useAppQuery'
import { useAppOnSocket } from './services/socket/useAppOnSocket'

export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const { data: workspaceData, isPending } = useAppQuery({
    key: 'workspace',
    url: {
      baseUrl: '/workspace'
    },
    options: {
      queryKey: ['/workspace']
    }
  })

  useEffect(() => {
    if (workspaceData) {
      const members = [
        ...(workspaceData?.channels.members || []),
        ...(workspaceData?.teams.members || []),
        ...(workspaceData?.groups.members || [])
      ].reduce((pre, next) => ({ ...pre, [next._id]: next }), {} as TMembers)

      dispatch(
        workspaceActions.updateData({
          teams: workspaceData?.teams.teams.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          ),
          channels: workspaceData?.channels.channels.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          ),
          directs: workspaceData?.directs.directs.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          ),
          groups: workspaceData?.groups.groups.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          ),

          users: workspaceData?.users.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          ),
          members
        })
      )
    }
  }, [dispatch, workspaceData])

  useAppOnSocket({
    key: 'workspaces',
    resFunc: ({ workspaces }) => {
      console.log(workspaces)
      const teams = workspaces.filter(e => e.type === 'team')
      const channels = workspaces.filter(e => e.type === 'channel')
      const directs = workspaces.filter(e => e.type === 'direct')
      const groups = workspaces.filter(e => e.type === 'group')
      const members = workspaces.filter(e => e.type === 'member')
      const users = workspaces.filter(e => e.type === 'user')

      console.log({ teams })

      dispatch(
        workspaceActions.updateData({
          teams: teams.reduce(
            (pre, next) => ({ ...pre, [next.data._id]: next.data }),
            {}
          ),
          channels: channels.reduce(
            (pre, next) => ({ ...pre, [next.data._id]: next.data }),
            {}
          ),
          groups: groups.reduce(
            (pre, next) => ({ ...pre, [next.data._id]: next.data }),
            {}
          ),
          directs: directs.reduce(
            (pre, next) => ({ ...pre, [next.data._id]: next.data }),
            {}
          ),
          members: members.reduce(
            (pre, next) => ({ ...pre, [next.data._id]: next.data }),
            {}
          ),
          users: users.reduce(
            (pre, next) => ({ ...pre, [next.data._id]: next.data }),
            {}
          )
        })
      )
    }
  })

  return (
    <>
      <div className='relative flex h-screen w-screen flex-col text-sm'>
        <LoadingOverlay
          visible={isPending}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
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
