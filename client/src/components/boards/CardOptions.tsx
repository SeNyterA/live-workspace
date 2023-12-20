import { Draggable, Droppable } from 'react-beautiful-dnd'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import CardItem from './card/CardItem'

export default function CardOptions({
  optionId,
  propertyId
}: {
  propertyId: string
  optionId: string
}) {
  const { boardId } = useAppParams()

  const cards = useAppSelector(state =>
    Object.values(state.workspace.cards).filter(
      card => card.boardId === boardId && card.data?.[propertyId] === optionId
    )
  )

  return (
    <Droppable droppableId={optionId} type='card' >
      {dropProvided => (
        <div
          className='mt-1'
          {...dropProvided.droppableProps}
          ref={dropProvided.innerRef}
        >
          {cards?.map((card, index) => (
            <Draggable key={card._id} draggableId={card._id} index={index}>
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
