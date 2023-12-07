import useAppControlParams from '../../../hooks/useAppControlParams'
import { EBlockType, TCard } from '../../../types/workspace.type'

export default function CardItem({ card }: { card: TCard }) {
  const { toogleCard } = useAppControlParams()

  const checkboxes =
    card?.blocks?.filter(e => e.blockType === EBlockType.Checkbox) || []

  return (
    <div
      className='mt-2 flex h-20 flex-col items-center justify-center bg-gray-100'
      id={card._id}
      onClick={() => {
        toogleCard({
          cardId: card._id
        })
      }}
    >
      {card.title}
      <span className='text-gray-600'>{`${
        checkboxes.filter(e => e.isCheck).length
      }`}</span>
    </div>
  )
}
