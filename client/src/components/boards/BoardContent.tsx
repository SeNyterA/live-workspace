import { ActionIcon, Divider } from '@mantine/core'
import { IconChevronRight } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import Info from '../message/info/Info'
import InfoProvier from '../message/info/InfoProvier'
import BoardHeader from './BoardHeader'
import BoardProvider from './BoardProvider'
import CardsContent from './CardsContent'

export default function BoardContent() {
  const { boardId } = useAppParams()

  const board = useAppSelector(state =>
    Object.values(state.workspace.boards).find(e => e._id === boardId)
  )

  const dispatch = useDispatch()
  const [openInfo, setOpenInfo] = useState(false)
  const { data: detailBoardData } = useAppQuery({
    key: 'boardData',
    url: {
      baseUrl: '/workspace/boards/:boardId',
      urlParams: {
        boardId: boardId!
      }
    },
    options: {
      queryKey: [boardId],
      enabled: !!boardId
    }
  })

  useAppOnSocket({
    key: 'boardData',
    resFunc: ({ boardData }) => {
      const cards = boardData.filter(e => e.type === 'card')
      const properties = boardData.filter(e => e.type === 'property')

      dispatch(
        workspaceActions.updateData({
          cards: cards.reduce(
            (pre, next) => ({ ...pre, [next.data._id]: next.data }),
            {}
          ),
          properties: properties.reduce(
            (pre, next) => ({ ...pre, [next.data._id]: next.data }),
            {}
          )
        })
      )
    }
  })

  useEffect(() => {
    if (detailBoardData)
      dispatch(
        workspaceActions.updateData({
          boards: { [detailBoardData.board._id]: detailBoardData.board },
          cards: detailBoardData.cards.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          ),
          properties: detailBoardData.properties.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {}
          )
        })
      )
  }, [detailBoardData])

  return (
    <div className='flex flex-1'>
      <BoardProvider>
        <div className='flex flex-1 flex-col'>
          <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
            <BoardHeader />
            <ActionIcon
              variant='light'
              className='h-[30px] w-[30px] bg-gray-100'
              onClick={() => setOpenInfo(e => !e)}
            >
              <IconChevronRight
                className={`h-4 w-4 transition-transform ${
                  openInfo || 'rotate-180'
                }`}
              />
            </ActionIcon>
          </div>
          <Divider variant='dashed' />
          <CardsContent />
        </div>
      </BoardProvider>

      {openInfo && (
        <>
          <Divider orientation='vertical' variant='dashed' />
          <InfoProvier
            value={{
              title: board?.title || '',
              targetId: { boardId },
              type: 'board'
            }}
          >
            <Info />
          </InfoProvier>
        </>
      )}
    </div>
  )
}
