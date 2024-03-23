import { Image } from '@mantine/core'
import { IconCheckbox } from '@tabler/icons-react'
import { memo } from 'react'
import useAppControlParams from '../../../../hooks/useAppControlParams'
import { TCard } from '../../../../types'
import { getItemsWithMatchingKey } from '../../../../utils/helper'

function CardItem({ card }: { card: TCard }) {
  const { toogleCard } = useAppControlParams()
  const checkboxes = getItemsWithMatchingKey(card.detail || {}, 'taskItem')

  return (
    <div
      className='flex flex-col rounded bg-blue-400/20 px-2 py-1'
      id={card.id}
      onClick={() => {
        toogleCard({
          cardId: card.id
        })
      }}
    >
      <Image
        loading='lazy'
        className='mt-1 rounded-lg'
        src={
          'https://s3.ap-southeast-1.amazonaws.com/liveworkspace.senytera/1709031245746_ca114960-a6a3-4acd-8b63-02f5a9155ed0_wallpapersden.com_stitched_woman_face_wxl.jpg'
        }
      />
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

export default memo(CardItem)
