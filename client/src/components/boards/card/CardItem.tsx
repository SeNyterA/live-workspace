import { IconCheckbox } from '@tabler/icons-react'
import useAppControlParams from '../../../hooks/useAppControlParams'
import { TCard } from '../../../new-types/board'
import { getItemsWithMatchingKey } from '../../../utils/helper'

export default function CardItem({ card }: { card: TCard }) {
  const { toogleCard } = useAppControlParams()
  const checkboxes = getItemsWithMatchingKey(card.properties || {}, 'taskItem')

  return (
    <div
      className='flex flex-col rounded bg-gray-100 px-2 py-1'
      id={card._id}
      onClick={() => {
        toogleCard({
          cardId: card._id
        })
      }}
    >
      <p className='line-clamp-2 flex-1 rounded'>
        {card.title}On the other hand, we denounce with righteous indignation
        and dislike men who are so
      </p>

      <div className='flex items-center text-gray-600'>
        {!!checkboxes.length && (
          <div className='flex items-center'>
            {`${checkboxes.filter(e => e.attrs && e.attrs['checked']).length}/${
              checkboxes.length
            }`}{' '}
            <IconCheckbox size={16} />
          </div>
        )}
      </div>
    </div>
  )
}
