import { Divider, LoadingOverlay } from '@mantine/core'
import { createContext, ReactNode, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import { arrayToObject } from '../../utils/helper'
import Sidebar from '../sidebar/Sidebar'
import AppHeader from './AppHeader'
import TeamList from './TeamList'

export type TThread = {
  threadId: string
  targetId: string
  replyId?: string
}

type TLayoutContext = {
  thread?: TThread
  updateThread: (thread?: TThread) => void
  openInfo?: boolean
  toggleInfo: (info: boolean) => void
}

const layoutContext = createContext<TLayoutContext>({
  updateThread() {},
  toggleInfo() {}
})
export const useLayout = () => useContext(layoutContext)

export default function Layout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const [thread, setThread] = useState<TThread>()
  const [openInfo, toggleInfo] = useState(false)
  const { teamId } = useAppParams()

  const { data: workspaces, isPending } = useAppQuery({
    key: 'workspaces',
    url: {
      baseUrl: '/workspaces'
    },
    onSucess(data) {

      console.log({data})
      dispatch(
        workspaceActions.updateWorkspaceStore({
          workspaces: data.reduce(
            (pre, next) => ({ ...pre, [next.id]: next }),
            {}
          )
        })
      )
    }
  })

  useAppQuery({
    key: 'workspace',
    url: {
      baseUrl: '/workspaces/:workspaceId',
      urlParams: { workspaceId: teamId! }
    },
    onSucess({ members, workspace }) {
      dispatch(
        workspaceActions.updateWorkspaceStore({
          workspaces: { [workspace.id]: workspace },
          members: arrayToObject(members, 'id'),
          users: arrayToObject(
            members.map(e => e.user!),
            'id'
          )
        })
      )
    },
    options: {
      enabled: !!teamId && teamId !== 'personal'
    }
  })

  useAppOnSocket({
    key: 'workspace',
    resFunc: ({ workspace }) => {
      dispatch(
        workspaceActions.updateWorkspaceStore({
          workspaces: { [workspace.id]: workspace }
        })
      )
    }
  })

  return (
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
          <layoutContext.Provider
            value={{
              thread,
              updateThread: thread => setThread(thread),

              openInfo,
              toggleInfo: info => toggleInfo(info)
            }}
          >
            {children}
          </layoutContext.Provider>
        </div>
      </div>
    </div>
  )
}
