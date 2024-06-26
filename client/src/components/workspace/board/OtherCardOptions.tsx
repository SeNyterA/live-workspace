import { Draggable, Droppable } from 'react-beautiful-dnd'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import { useBoard } from './BoardProvider'
import CardItem from './card/CardItem'

export default function CardOptions({
  optionId,
  propertyId
}: {
  propertyId: string
  optionId: string
}) {
  const { boardId } = useAppParams()
  const { searchValue } = useBoard()

  const cards = useAppSelector(state =>
    Object.values(state.workspace.cards).filter(
      card =>
        card.workspaceId === boardId &&
        card.properties?.[propertyId] === optionId &&
        card.title.toLowerCase().includes(searchValue?.toLowerCase() || '')
    )
  )?.sort((a, b) => a.order - b.order)

  return (
    <Droppable droppableId={optionId} type='card'>
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
                  className='py-1'
                  {...dragProvided.dragHandleProps}
                  {...dragProvided.draggableProps}
                  ref={dragProvided.innerRef}
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
  )
}
