import { ActionIcon, Divider, Input, ScrollArea, Table } from '@mantine/core'
import { IconChevronRight, IconPlus, IconSearch } from '@tabler/icons-react'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import { UsersStack } from './UsersSlack'

export default function MembersManager() {
  const { teamId } = useAppParams()

  const members = useAppSelector(state =>
    Object.values(state.workspace.members)
      .filter(e => e.targetId === teamId)
      .map(member => ({ member, user: state.workspace.users[member.userId] }))
  )

  console.log({ members })
  return (
    <div className='flex h-full w-full flex-col'>
      <div className='flex flex-1 flex-col'>
        <div className='flex h-12 w-full items-center justify-end gap-2 px-3'>
          {/* <label className='flex cursor-pointer items-center justify-center gap-1 rounded'>
            <p className='ml-1'>Group by:</p>
            <Select
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-100 min-h-[30px] h-[30px]'
              }}
              className='w-32'
              data={propertiesChecking?.map(e => ({
                label: e.title,
                value: e._id
              }))}
              value={trackingId}
              onChange={propertyCheckingId => {
                propertyCheckingId && setTrackingId(propertyCheckingId)
              }}
            />
          </label> */}

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

        <div className='relative flex-1'>
          <ScrollArea className='absolute inset-0'>
            <UsersStack />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
