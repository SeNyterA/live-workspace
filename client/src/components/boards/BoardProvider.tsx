import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { EFieldType } from '../../new-types/board.d'
import { TWorkspace } from '../../new-types/workspace'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { TProperty } from '../../types/workspace.type'
import { lsActions } from '../../utils/auth'
import { arrayToObject, extractWorkspace } from '../../utils/helper'

type TSortBy = 'label' | 'createdAt' | 'updatedAt'

type TBoardContext = {
  boardId?: string
  board?: TWorkspace
  trackingId?: string
  sortBy?: TSortBy
  setSortBy: (sortBy: TSortBy) => void
  setTrackingId: (trackingId: string) => void
}

const boardContext = createContext<TBoardContext>({
  setSortBy: () => {},
  setTrackingId: () => {}
})

export const useBoard = () => useContext(boardContext)
export default function BoardProvider({ children }: { children: ReactNode }) {
  const { boardId } = useAppParams()
  const [trackingId, setTrackingId] = useState<string>()
  const [sortBy, setSortBy] = useState<TSortBy>('label')

  const dispatch = useDispatch()
  const { data: detailBoardData } = useAppQuery({
    key: 'board',
    url: {
      baseUrl: '/boards/:boardId',
      urlParams: {
        boardId: boardId!
      }
    },
    options: {
      queryKey: [boardId],
      enabled: !!boardId
    }
  })
  useEffect(() => {
    if (detailBoardData) {
      const { cards, members, options, properties, users, workspace } =
        extractWorkspace(detailBoardData)

      dispatch(
        workspaceActions.updateData({
          cards: arrayToObject(cards || [], '_id'),
          members: arrayToObject(members || [], '_id'),
          options: arrayToObject(options || [], '_id'),
          properties: arrayToObject(properties || [], '_id'),
          users: arrayToObject(users || [], '_id'),
          workspaces: { [workspace._id]: workspace }
        })
      )
    }
  }, [detailBoardData])

  const board = useAppSelector(
    state => state.workspace.workspaces[boardId || '']
  )
  const properties = useAppSelector(state =>
    Object.values(state.workspace.properties).filter(e => e.boardId === boardId)
  )

  useEffect(() => {
    const _trackingId = checkTrackingId({
      boardId,
      properties
    })

    console.log({ _trackingId, trackingId })

    if (!!_trackingId && _trackingId !== trackingId) {
      setTrackingId(_trackingId)
    }
  }, [properties, boardId, trackingId])

  return (
    <boardContext.Provider
      value={{
        board,
        boardId,
        sortBy,
        trackingId,
        setSortBy: value => {
          setSortBy(value)
        },
        setTrackingId: value => {
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
  properties
}: {
  properties?: TProperty[]
  boardId?: string
}) => {
  if (!boardId) return
  if (!properties) return

  const trackingId = lsActions.getTrackingId(boardId)

  console.log({
    boardId,
    properties,
    trackingId
  })

  let _trackingId = properties.find(
    e =>
      e._id === trackingId &&
      [EFieldType.Assignees, EFieldType.People, EFieldType.Select].includes(
        e.fieldType
      )
  )?._id

  if (_trackingId) {
    lsActions.setTrackingId(boardId, _trackingId)
    return _trackingId
  }

  _trackingId = properties.find(e =>
    [EFieldType.Assignees, EFieldType.People, EFieldType.Select].includes(
      e.fieldType
    )
  )?._id

  if (_trackingId) {
    lsActions.setTrackingId(boardId, _trackingId)
    return _trackingId
  }
}
