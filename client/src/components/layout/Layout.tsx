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
    onSucess(data) {
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
    onSucess({ members, workspace }) {
      dispatch(
        workspaceActions.updateWorkspaceStore(
          extractApi({
            members,
            workspaces: [workspace]
          })
        )
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

  return (
    <>
      <div className='fixed inset-0 bg-[url(/auth-bg.jpg)] bg-cover bg-center bg-no-repeat blur-sm'></div>
      <div className='fixed inset-0 z-[1] flex h-screen w-screen flex-col text-sm text-gray-100'>
        <LoadingOverlay
          visible={isPending}
          classNames={{
            overlay: 'bg-black/50'
          }}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <AppHeader />

        <div className='flex flex-1 bg-black/80'>
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
