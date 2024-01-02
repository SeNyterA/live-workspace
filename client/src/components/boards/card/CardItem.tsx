import { IconCheckbox } from '@tabler/icons-react'
import useAppControlParams from '../../../hooks/useAppControlParams'
import { TCard } from '../../../types/workspace.type'
import { getItemsWithMatchingKey } from '../../../utils/helper'

export default function CardItem({ card }: { card: TCard }) {
  const { toogleCard } = useAppControlParams()
  const checkboxes = getItemsWithMatchingKey(card.data || {}, 'taskItem')

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
      <p className='line-clamp-3 flex-1'>{card.title}</p>
      <div className='flex items-center text-gray-600'>
        {`${checkboxes.filter(e => e.attrs && e.attrs['checked']).length}/${
          checkboxes.length
        }`}{' '}
        <IconCheckbox size={16} />
      </div>
    </div>
  )
}
