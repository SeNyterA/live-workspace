import { ActionIcon, Badge } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { Draggable, DraggableProvided, Droppable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../../hooks/useAppControlParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { appMutationFn } from '../../../services/apis/mutations/useAppMutation'
import { extractApi, TPropertyOption } from '../../../types'
import { useBoard } from './BoardProvider'
import CardItem from './card/CardItem'

export default function CardOptions({
  propertyId,
  option,
  dragProvided
}: {
  propertyId: string
  option?: TPropertyOption
  dragProvided?: DraggableProvided
}) {
  const { toogleCard } = useAppControlParams()

  const dispatch = useDispatch()
  const { searchValue } = useBoard()
  const { trackingId, boardId } = useBoard()
  const cards = useAppSelector(state =>
    Object.values(state.workspace.cards).filter(
      card =>
        card.workspaceId === boardId &&
        (option?.id
          ? card.properties?.[propertyId] === option.id
          : !Object.values(state.workspace.options)
              .filter(option => option.propertyId === propertyId)
              .map(option => option.id)
              .includes(card.properties?.[propertyId])) &&
        card.title.toLowerCase().includes(searchValue?.toLowerCase() || '')
    )
  )?.sort((a, b) => a.order - b.order)

  return (
    <>
      <div
        {...dragProvided?.dragHandleProps}
        className='sticky top-0 outline-none'
        tabIndex={-1}
      >
        <div className='column-header flex h-9 items-center justify-between gap-2 rounded border px-2 pr-1'>
          <Badge
            classNames={{
              root: 'p-0 rounded-none bg-transparent flex-1 flex',
              label: 'flex-1'
            }}
            leftSection={
              <div
                className={`h-4 w-4 rounded`}
                style={{ backgroundColor: option?.color || 'gray' }}
              />
            }
            rightSection={<span>{cards?.length}</span>}
          >
            {option ? option?.title : 'Other'}
          </Badge>

          <ActionIcon
            aria-label='Settings'
            size={20}
            onClick={() => {
              appMutationFn({
                key: 'createCard',
                url: {
                  baseUrl: 'boards/:boardId/cards',
                  urlParams: {
                    boardId: boardId!
                  }
                },
                method: 'post',
                payload: {
                  card: {
                    title: 'New Card',
                    properties: {
                      [trackingId!]: option?.id!
                    }
                  }
                }
              }).then(result => {
                dispatch(
                  workspaceActions.updateWorkspaceStore(
                    extractApi({
                      cards: [result]
                    })
                  )
                )
                toogleCard({ cardId: result.id })
              })
            }}
          >
            <IconPlus size={16} stroke={1.5} />
          </ActionIcon>
        </div>
      </div>
      <Droppable droppableId={option?.id || 'orther'} type='card'>
        {dropProvided => (
          <div
            className='mt-1'
            {...dropProvided.droppableProps}
            ref={dropProvided.innerRef}
          >
            {cards?.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {dragProvided => (
                  <div
                    className='card-item-wrapper mt-2 flex flex-col rounded p-2'
                    {...dragProvided.dragHandleProps}
                    {...dragProvided.draggableProps}
                    ref={dragProvided.innerRef}
                    onKeyDown={e => {
                      if (e.key === 'Enter') toogleCard({ cardId: card.id })
                    }}
                    onClick={() => toogleCard({ cardId: card.id })}
                  >
                    <CardItem card={card} />
                  </div>
                )}
              </Draggable>
            ))}
            {dropProvided.placeholder}
          </div>
        )}
      </Droppable>
    </>
  )
}
