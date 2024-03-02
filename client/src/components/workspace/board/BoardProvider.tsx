import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppQuery } from '../../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../../services/socket/useAppOnSocket'
import { EFieldType, TProperty, TWorkspace } from '../../../types'
import { lsActions } from '../../../utils/auth'
import { arrayToObject, extractWorkspace } from '../../../utils/helper'

export type TSortBy = 'label' | 'createdAt' | 'updatedAt'

type TBoardContext = {
  boardId?: string
  board?: TWorkspace
  trackingId?: string
  sortBy?: TSortBy
  setSortBy: (sortBy: TSortBy) => void
  setTrackingId: (trackingId: string) => void
  searchValue?: string
  setSearchValue: (searchValue: string) => void
}

const boardContext = createContext<TBoardContext>({
  setSortBy: () => {},
  setTrackingId: () => {},
  setSearchValue: () => {}
})

export const useBoard = () => useContext(boardContext)
export default function BoardProvider({ children }: { children: ReactNode }) {
  const { boardId } = useAppParams()
  const [trackingId, setTrackingId] = useState<string>()
  const [sortBy, setSortBy] = useState<TSortBy>('label')
  const [searchValue, setSearchValue] = useState<string>('')

  const dispatch = useDispatch()
  useAppQuery({
    key: 'board',
    url: {
      baseUrl: '/boards/:boardId',
      urlParams: {
        boardId: boardId!
      }
    },
    options: {
      queryKey: [boardId!],
      enabled: !!boardId
    },
    onSucess(data) {
      const { cards, members, options, properties, users, workspace } =
        extractWorkspace(data)

      dispatch(
        workspaceActions.updateWorkspaceStore({
          cards: arrayToObject(cards || [], '_id'),
          members: arrayToObject(members || [], '_id'),
          options: arrayToObject(options || [], '_id'),
          properties: arrayToObject(properties || [], '_id'),
          users: arrayToObject(users || [], '_id'),
          workspaces: { [workspace._id]: workspace }
        })
      )
    }
  })

  useAppOnSocket({
    key: 'option',
    resFunc(data) {
      dispatch(
        workspaceActions.updateWorkspaceStore({
          options: {
            [data.option._id]: data.option
          }
        })
      )
    }
  })

  useAppOnSocket({
    key: 'card',
    resFunc(data) {
      dispatch(
        workspaceActions.updateWorkspaceStore({
          cards: { [data.card._id]: data.card }
        })
      )
    }
  })

  const board = useAppSelector(
    state => state.workspace.workspaces[boardId || '']
  )
  const properties = useAppSelector(state =>
    Object.values(state.workspace.properties).filter(e => e.boardId === boardId)
  )

  useEffect(() => {
    const _trackingId = checkTrackingId({
      boardId,
      properties,
      trackingId
    })

    if (_trackingId) {
      setTrackingId(_trackingId)
    }
  }, [properties, boardId, trackingId])

  console.log({ trackingId })

  return (
    <boardContext.Provider
      value={{
        board,
        boardId,
        sortBy,
        trackingId,
        setSearchValue,
        searchValue,
        setSortBy: value => {
          setSortBy(value)
        },
        setTrackingId: value => {
          console.log({ value })
          if (
            properties?.find(
              e =>
                e._id === value &&
                [
                  EFieldType.Assignees,
                  EFieldType.People,
                  EFieldType.Select
                ].includes(e.fieldType)
            )
          ) {
            setTrackingId(value)
            lsActions.setTrackingId(boardId!, value)
          }
        }
      }}
    >
      {children}
    </boardContext.Provider>
  )
}

const checkTrackingId = ({
  boardId,
  properties,
  trackingId
}: {
  properties?: TProperty[]
  boardId?: string
  trackingId?: string
}) => {
  if (!boardId) return
  if (!properties) return

  if (
    properties.find(
      e =>
        e._id === trackingId &&
        [EFieldType.Assignees, EFieldType.People, EFieldType.Select].includes(
          e.fieldType
        )
    )?._id
  )
    return undefined

  const lsTrackingId = lsActions.getTrackingId(boardId)

  let _trackingId = properties.find(
    e =>
      e._id === lsTrackingId &&
      [EFieldType.Assignees, EFieldType.People, EFieldType.Select].includes(
        e.fieldType
      )
  )?._id

  if (_trackingId) {
    lsActions.setTrackingId(boardId, _trackingId)
    return _trackingId
  }

  _trackingId = properties.find(e => [EFieldType.Select].includes(e.fieldType))
    ?._id

  if (_trackingId) {
    lsActions.setTrackingId(boardId, _trackingId)
    return _trackingId
  }
}
