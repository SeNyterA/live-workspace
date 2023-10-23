import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconFilter, IconSearch } from '@tabler/icons-react'
import CardsContent from './CardsContent'

export default function BoardContent() {
  return (
    <div className='flex-1 flex flex-col'>
      <div className='h-12 w-full flex justify-end gap-2 items-center px-3'>
        <p className='flex-1 text-base font-medium'>Task tuần 1</p>

        <Input
          placeholder='search card name'
          size='xs'
          leftSection={<IconSearch className='w-4 h-4' />}
        />

        <ActionIcon variant='default'>
          <IconFilter />
        </ActionIcon>
      </div>
      <Divider variant='dashed' />
      <CardsContent />
    </div>
  )
}
