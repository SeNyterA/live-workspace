import { Divider, LoadingOverlay } from '@mantine/core'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { useDispatch } from 'react-redux'
import AppHeader from './components/layouts/AppHeader'
import Sidebar from './components/sidebar/Sidebar'
import TeamList from './components/sidebar/team/TeamList'
import useAppParams from './hooks/useAppParams'
import { workspaceActions } from './redux/slices/workspace.slice'
import { useAppQuery } from './services/apis/useAppQuery'

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
  const { boardId, channelId, directId, groupId, teamId } = useAppParams()

  const { data: workspaces, isPending } = useAppQuery({
    key: 'workspaces',
    url: {
      baseUrl: '/workspaces'
    }
  })

  const { data: team, isPending: teamLoading } = useAppQuery({
    key: 'workspace',
    url: {
      baseUrl: '/workspaces/:workspaceId',
      urlParams: {
        workspaceId: teamId || ''
      }
    },
    options: {
      queryKey: [teamId],
      enabled: !!teamId
    }
  })

  useEffect(() => {
    if (workspaces) {
      dispatch(
        workspaceActions.init({
          workspaces: workspaces.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          )
        })
      )
    }
  }, [dispatch, workspaces])

  const { data: unReadCountData } = useAppQuery({
    key: 'getUnreadCounts',
    url: {
      baseUrl: 'workspace/getUnreadCounts'
    }
  })
  // useEffect(() => {
  //   if (unReadCountData) {
  //     dispatch(workspaceActions.setUnreadCounts(unReadCountData))
  //   }
  // }, [dispatch, unReadCountData])

  // useAppOnSocket({
  //   key: 'workspaces',
  //   resFunc: ({ workspaces }) => {}
  // })

  // useAppOnSocket({
  //   key: 'unReadCount',
  //   resFunc: ({ count, targetId }) => {
  //     dispatch(workspaceActions.setUnreadCounts({ [targetId]: count }))
  //   }
  // })

  // useAppOnSocket({
  //   key: 'users',
  //   resFunc: ({ users }) => {
  //     dispatch(
  //       workspaceActions.addUsers(
  //         users.reduce(
  //           (pre, next) => ({ ...pre, [next.data._id]: next.data }),
  //           {}
  //         )
  //       )
  //     )
  //   }
  // })

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
