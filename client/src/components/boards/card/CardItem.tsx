import useAppControlParams from '../../../hooks/useAppControlParams'
import { EBlockType, TCard } from '../../../types/workspace.type'

export default function CardItem({ card }: { card: TCard }) {
  const { toogleCard } = useAppControlParams()

  const checkboxes =
    card?.blocks?.filter(e => e.blockType === EBlockType.Checkbox) || []

  return (
    <div
      className='flex min-h-[80px] flex-col rounded bg-gray-100 px-2 py-1'
      id={card._id}
      onClick={() => {
        toogleCard({
          cardId: card._id
        })
      }}
    >
      <p className='line-clamp-3'>{card.title}</p>
      <span className='text-gray-600'>{`${
        checkboxes.filter(e => e.isCheck).length
      }`}</span>
    </div>
  )
}
