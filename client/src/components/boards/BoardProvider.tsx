import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import { EFieldType } from '../../services/apis/board.api'
import { TBoard } from '../../types/workspace.type'
import { lsActions } from '../../utils/auth'

type TSortBy = 'label' | 'createdAt' | 'updatedAt'

type TBoardContext = {
  boardId?: string
  board?: TBoard
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

  const board = useAppSelector(state => state.workspace.boards[boardId || ''])
  const properties = useAppSelector(state =>
    Object.values(state.workspace.properties).filter(e => e.boardId === boardId)
  )

  useEffect(() => {
    if (!boardId || !properties) return

    if (!trackingId) {
      const _trackingId = lsActions.getTrackingId(boardId)
      const foundProperty = properties.find(
        e =>
          e._id === _trackingId &&
          [EFieldType.Assignees, EFieldType.People, EFieldType.Select].includes(
            e.fieldType
          )
      )

      if (foundProperty) {
        setTrackingId(_trackingId!)
      } else {
        const __trackingId = properties.find(e =>
          [EFieldType.Assignees, EFieldType.People, EFieldType.Select].includes(
            e.fieldType
          )
        )?._id

        if (__trackingId) {
          setTrackingId(__trackingId)
          lsActions.setTrackingId(boardId, __trackingId)
        }
      }
    } else {
      const foundTrackingProperty = properties.find(
        e =>
          e._id === trackingId &&
          [EFieldType.Assignees, EFieldType.People, EFieldType.Select].includes(
            e.fieldType
          )
      )
      if (!foundTrackingProperty) {
        const __trackingId = properties.find(e =>
          [EFieldType.Assignees, EFieldType.People, EFieldType.Select].includes(
            e.fieldType
          )
        )?._id

        if (__trackingId) {
          setTrackingId(__trackingId)
          lsActions.setTrackingId(boardId, __trackingId)
        }
      }
    }
  }, [boardId, properties])

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
