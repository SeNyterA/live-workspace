import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react'
import { InviteMember } from './InviteMember'
import { UsersStack } from './UsersSlack'

export default function MembersManager() {
  return (
    <div className='flex h-full w-full gap-4'>
      <div className='flex flex-[5] flex-col'>
        <div className='flex h-12 w-full items-center justify-end gap-2'>
          <Input
            className='flex h-[30px] items-center rounded bg-gray-100'
            size='sm'
            placeholder='Search members'
            leftSection={<IconSearch size={14} />}
            classNames={{
              input: 'bg-transparent border-none min-h-[20px] h-[20px]'
            }}
          />

          <ActionIcon variant='light' className='h-[30px] w-[30px] bg-gray-100'>
            <IconPlus className={`h-4 w-4 transition-transform`} />
          </ActionIcon>
        </div>
        <Divider variant='dashed' />

        <UsersStack />
      </div>

      <Divider variant='dashed' orientation='vertical' />

      <div className='flex w-[300px] flex-col'>
        <div className='flex h-12 w-full items-center justify-end gap-2'>
          <Input
            className='flex h-[30px] items-center rounded bg-gray-100'
            size='sm'
            placeholder='orther members'
            leftSection={<IconSearch size={14} />}
            classNames={{
              input: 'bg-transparent border-none min-h-[20px] h-[20px]'
            }}
          />

          <ActionIcon variant='light' className='h-[30px] w-[30px] bg-gray-100'>
            <IconX className={`h-4 w-4 transition-transform`} />
          </ActionIcon>
        </div>
        <Divider variant='dashed' />

        <InviteMember />
      </div>
    </div>
  )
}
