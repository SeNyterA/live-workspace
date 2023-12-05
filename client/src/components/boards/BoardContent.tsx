import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconFilter, IconPlus, IconSearch } from '@tabler/icons-react'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { useAppQuery } from '../../services/apis/useAppQuery'
import CardsContent from './CardsContent'

export default function BoardContent() {
  const { boardId } = useAppParams()

  const { data } = useAppQuery({
    key: 'boardData',
    url: {
      baseUrl: '/workspace/boards/:boardId',
      urlParams: {
        boardId: boardId!
      }
    },
    options: {
      queryKey: [boardId],
      enabled: !!boardId
    }
  })
  console.log(data)

  const board = useAppSelector(state =>
    Object.values(state.workspace.boards).find(e => e._id === boardId)
  )

  const { mutateAsync: createCard } = useAppMutation('createCard')
  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
        <p className='flex-1 text-base font-medium'>{board?.title}</p>

        <ActionIcon
          variant='transparent'
          aria-label='Settings'
          className='h-[30px] w-[30px] bg-gray-100 text-gray-600'
          onClick={() => {
            Array(100)
              .fill(1)
              .map(_ => {
                const timeStamp = new Date().getMilliseconds()
                createCard({
                  url: {
                    baseUrl: '/workspace/boards/:boardId/cards',
                    urlParams: {
                      boardId: boardId!
                    }
                  },
                  method: 'post',
                  payload: {
                    title: 'anything bro' + timeStamp,
                    data: {
                      key1: 'hahahah',
                      key2: ['string1', 'text2']
                    }
                  }
                })
              })
          }}
        >
          <IconPlus size={16} stroke={1.5} />
        </ActionIcon>

        <Input
          className='flex h-[30px] items-center rounded bg-gray-100'
          size='sm'
          placeholder='Search card name'
          leftSection={<IconSearch size={14} />}
          classNames={{
            input: 'bg-transparent border-none min-h-[20px] h-[20px]'
          }}
        />

        <ActionIcon
          variant='transparent'
          aria-label='Settings'
          className='h-[30px] w-[30px] bg-gray-100 text-gray-600'
        >
          <IconFilter size={16} stroke={1.5} />
        </ActionIcon>
      </div>
      <Divider variant='dashed' />
      <CardsContent />
    </div>
  )
}
