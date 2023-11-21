import { Divider, LoadingOverlay } from '@mantine/core'
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
import { appGetFn, useAppQuery } from './services/apis/useAppQuery'
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
    }
  }, [dispatch, workspaceData])

  useAppOnSocket({
    key: 'workspace',
    resFunc: async ({ data, type }) => {
      switch (type) {
        case 'direct':
          appGetFn({
            key: 'findDirectInfo',
            url: {
              baseUrl: '/workspace/direct-messages',
              queryParams: {
                directId: data._id
              }
            }
          }).then(({ direct, users }) => {
            dispatch(
              workspaceActions.updateData({
                directs: { [direct._id]: direct },
                users: users.reduce(
                  (pre, next) => ({ ...pre, [next._id]: next }),
                  {}
                )
              })
            )
          })

          break
        case 'team':
          dispatch(
            workspaceActions.addTeams({
              [data._id]: data
            })
          )
          break
        case 'channel':
          dispatch(
            workspaceActions.addChannels({
              [data._id]: data
            })
          )
          break
        case 'group':
          dispatch(
            workspaceActions.addGroups({
              [data._id]: data
            })
          )
          break
      }
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
