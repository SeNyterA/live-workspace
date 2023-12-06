import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'

export default function CardOptions({
  optionId,
  propertyId
}: {
  propertyId?: string
  optionId?: string
}) {
  const { boardId } = useAppParams()
  const cards = useAppSelector(state =>
    Object.values(state.workspace.cards).filter(card =>
      card.boardId === boardId && !!optionId && !!propertyId
        ? card.data[propertyId] === optionId
        : true
    )
  )

  return (
    <>
      {cards?.map(card => (
        <div key={card._id} className='flex h-20 items-center justify-center bg-gray-100 mt-2'>
          {card.title}
        </div>
      ))}
    </>
  )
}
