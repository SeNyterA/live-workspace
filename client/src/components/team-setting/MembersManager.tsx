import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconChevronRight, IconPlus, IconSearch } from '@tabler/icons-react'
import { UsersStack } from './UsersSlack'

export default function MembersManager() {
  return (
    <div className='flex h-full w-full flex-col'>
      <div className='flex flex-1 flex-col'>
        <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
          <Input
            className='flex h-[30px] items-center rounded bg-gray-100'
            size='sm'
            placeholder='Search card name'
            leftSection={<IconSearch size={14} />}
            classNames={{
              input: 'bg-transparent border-none min-h-[20px] h-[20px]'
            }}
          />

          <ActionIcon variant='light' className='h-[30px] w-[30px] bg-gray-100'>
            <IconPlus className={`h-4 w-4 transition-transform`} />
          </ActionIcon>

          <ActionIcon variant='light' className='h-[30px] w-[30px] bg-gray-100'>
            <IconChevronRight className={`h-4 w-4 transition-transform`} />
          </ActionIcon>
        </div>
        <Divider variant='dashed' />

        <UsersStack />
      </div>
    </div>
  )
}
