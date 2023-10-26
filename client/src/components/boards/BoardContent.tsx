import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconFilter, IconSearch } from '@tabler/icons-react'
import CardsContent from './CardsContent'

export default function BoardContent() {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
        <p className='flex-1 text-base font-medium'>Task tuần 1</p>

        <Input
          placeholder='search card name'
          size='xs'
          leftSection={<IconSearch className='h-4 w-4' />}
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
