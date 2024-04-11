import { Image } from '@mantine/core'
import { IconCheckbox } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { memo } from 'react'
import useAppControlParams from '../../../../hooks/useAppControlParams'
import Watching from '../../../../redux/Watching'
import { TCard } from '../../../../types'
import { getItemsWithMatchingKey } from '../../../../utils/helper'

function CardItem({ card }: { card: TCard }) {
  const { toogleCard } = useAppControlParams()
  const checkboxes = getItemsWithMatchingKey(card.detail || {}, 'taskItem')

  return (
    <div
      className='card-item-wrapper flex flex-col rounded p-2'
      id={card.id}
      onClick={() => {
        toogleCard({
          cardId: card.id
        })
      }}
    >
      <Watching
        watchingFn={state => state.workspace.files[card.thumbnailId!].path}
      >
        {path =>
          !!path && (
            <Image
              loading='lazy'
              className='mb-2 aspect-video rounded-lg'
              src={path}
              alt='Card thumbnail'
            />
          )
        }
      </Watching>

      <p className='line-clamp-2 flex-1 rounded'>{card.title}</p>

      <div className='flex items-center text-xs '>
        {!!checkboxes.length && (
          <div className='mr-2 flex items-center'>
            {`${checkboxes.filter(e => e.attrs && e.attrs['checked']).length}/${
              checkboxes.length
            }`}{' '}
            <IconCheckbox size={16} />
          </div>
        )}

        <span>{dayjs(card.updatedAt).format('MMM DD HH:mm')}</span>
      </div>
    </div>
  )
}

export default memo(CardItem)
