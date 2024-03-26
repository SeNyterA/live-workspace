import { Badge, Image } from '@mantine/core'
import { IconCheckbox } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { memo } from 'react'
import useAppControlParams from '../../../../hooks/useAppControlParams'
import Watching from '../../../../redux/Watching'
import { TCard } from '../../../../types'
import { getItemsWithMatchingKey } from '../../../../utils/helper'
import UserAvatar from '../../../common/UserAvatar'

function CardItem({ card }: { card: TCard }) {
  const { toogleCard } = useAppControlParams()
  const checkboxes = getItemsWithMatchingKey(card.detail || {}, 'taskItem')

  return (
    <div
      className='flex flex-col rounded bg-blue-400/20 p-2'
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

      <div className='flex items-center text-xs text-gray-400'>
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

      {/* <Watching watchingFn={state => state.workspace.users[card?.createdById!]}>
        {user =>
          !!user && (
            <div className='flex gap-1'>
              <UserAvatar size={16} user={user} showSatus={false} />
              <span>{user.nickName || user.userName}</span>
            </div>
          )
        }
      </Watching> */}

      {/* <Badge
        classNames={{ root: 'p-0 rounded-none bg-transparent' }}
        leftSection={
          <div className='h-4 w-4 rounded bg-white bg-yellow-400'></div>
        }
      >
        sss
      </Badge> */}
    </div>
  )
}

export default memo(CardItem)
