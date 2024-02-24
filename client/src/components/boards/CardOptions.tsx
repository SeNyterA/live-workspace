import { Draggable, Droppable } from 'react-beautiful-dnd'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
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
  const { sortBy, searchValue } = useBoard()
  const cards = useAppSelector(state =>
    Object.values(state.workspace.cards).filter(
      card =>
        card.boardId === boardId &&
        card.properties?.[propertyId] === optionId &&
        card.title.toLowerCase().includes(searchValue?.toLowerCase() || '')
    )
  )?.sort((a, b) => {
    switch (sortBy) {
      case 'label':
        return a.title.localeCompare(b.title)
      case 'createdAt':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'updatedAt':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      default:
        return a.title.localeCompare(b.title)
    }
  })

  return (
    <Droppable droppableId={optionId} type='card'>
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
