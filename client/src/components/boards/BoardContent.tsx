import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconFilter, IconSearch } from '@tabler/icons-react'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import CardsContent from './CardsContent'

export default function BoardContent() {
  const { boardId } = useAppParams()

  const board = useAppSelector(state =>
    Object.values(state.workspace.boards).find(e => e._id === boardId)
  )
  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
        <p className='flex-1 text-base font-medium'>{board?.title}</p>

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
