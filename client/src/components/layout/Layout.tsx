import { LoadingOverlay } from '@mantine/core'
import { createContext, ReactNode, useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import { extractApi } from '../../types'
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

  const { isPending } = useAppQuery({
    key: 'workspaces',
    url: {
      baseUrl: '/workspaces'
    },
    onSuccess(data) {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            workspaces: data
          })
        )
      )
    }
  })

  useAppQuery({
    key: 'workspace',
    url: {
      baseUrl: '/workspaces/:workspaceId',
      urlParams: { workspaceId: teamId! }
    },
    onSuccess({ workspace, usersPresence }) {
      dispatch(
        workspaceActions.updateWorkspaceStore({
          ...extractApi({
            workspaces: [workspace]
          }),
          presents: usersPresence
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
        workspaceActions.updateWorkspaceStore(
          extractApi({
            workspaces: [workspace]
          })
        )
      )
    }
  })

  useAppOnSocket({
    key: 'workspaces',
    resFunc: ({ workspaces }) => {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            workspaces
          })
        )
      )
    }
  })

  useAppOnSocket({
    key: 'user',
    resFunc: ({ user }) => {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            users: [user]
          })
        )
      )
    }
  })

  useAppOnSocket({
    key: 'userPresence',
    resFunc: data => {
      dispatch(workspaceActions.updateWorkspaceStore({ presents: data }))
    }
  })

  useAppOnSocket({
    key: 'typing',
    resFunc: data => {
      dispatch(
        workspaceActions.toogleTyping({
          isTyping: data.isTyping,
          userId: data.userId,
          workpsaceId: data.targetId
        })
      )
    }
  })

  useAppOnSocket({
    key: 'unread',
    resFunc: data => {
      dispatch(
        workspaceActions.updateWorkspaceStore({
          unreads: {
            [data.workspaceId]: data.count
          }
        })
      )
    }
  })

  useAppOnSocket({
    key: 'checkpointMessage',
    resFunc: data => {}
  })

  return (
    <>
      {/* <div className='fixed inset-0 bg-[url(/auth-bg.jpg)] bg-cover bg-center bg-no-repeat blur' /> */}
      {/* <div className='fixed inset-0 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-blue-500 to-90% bg-cover bg-center bg-no-repeat blur' /> */}
        <div className='fixed inset-0 bg-sky-800 bg-cover bg-center bg-no-repeat blur' />

      <div className='layout fixed inset-0 flex h-screen w-screen flex-col text-sm'>
        <LoadingOverlay
          visible={isPending}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <AppHeader />

        <div className='flex flex-1 '>
          <TeamList />

          <div className='flex flex-1'>
            <Sidebar />

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
    </>
  )
}
