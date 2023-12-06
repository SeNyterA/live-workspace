import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconFilter, IconPlus, IconSearch } from '@tabler/icons-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import CardsContentV2 from './CardsContentV2'

export default function BoardContent() {
  const { boardId } = useAppParams()
  const dispatch = useDispatch()

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

  const board = useAppSelector(state =>
    Object.values(state.workspace.boards).find(e => e._id === boardId)
  )

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
    <div className='flex flex-1 flex-col'>
      <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
        <p className='flex-1 text-base font-medium'>{board?.title}</p>

        <ActionIcon
          variant='transparent'
          aria-label='Settings'
          className='h-[30px] w-[30px] bg-gray-100 text-gray-600'
        >
          <IconPlus size={16} stroke={1.5} />
        </ActionIcon>

        <Input
          className='flex h-[30px] items-center rounded bg-gray-100'
          size='sm'
          placeholder='Search card name'
          leftSection={<IconSearch size={14} />}
          classNames={{
            input: 'bg-transparent border-none min-h-[20px] h-[20px]'
          }}
        />

        <ActionIcon
          variant='transparent'
          aria-label='Settings'
          className='h-[30px] w-[30px] bg-gray-100 text-gray-600'
        >
          <IconFilter size={16} stroke={1.5} />
        </ActionIcon>
      </div>
      <Divider variant='dashed' />
      {/* <CardsContent /> */}
      <CardsContentV2 />
    </div>
  )
}
