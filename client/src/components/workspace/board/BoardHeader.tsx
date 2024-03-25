import { ActionIcon, Input, Select } from '@mantine/core'
import { IconFilter, IconSearch } from '@tabler/icons-react'
import { useAppSelector } from '../../../redux/store'
import { EPropertyType } from '../../../types'
import { useBoard } from './BoardProvider'

export default function BoardHeader() {
  const {
    trackingId,
    setTrackingId,
    sortBy,
    setSortBy,
    board,
    boardId,
    setSearchValue,
    searchValue
  } = useBoard()

  const propertiesChecking = useAppSelector(state =>
    Object.values(state.workspace.properties).filter(
      property =>
        property.workspaceId === boardId &&
        [EPropertyType.People, EPropertyType.Select].includes(property.type)
    )
  )

  return (
    <>
      <p className='flex-1 text-base font-medium'>{board?.title}</p>
      <label className='flex cursor-pointer items-center justify-center gap-1 rounded'>
        <p className='ml-1'>Group by:</p>
        <Select
          classNames={{
            input:
              'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px] h-[30px]',
            dropdown: '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
            option: 'hover:bg-gray-700/90'
          }}
          className='w-32'
          data={propertiesChecking?.map(e => ({
            label: e.title,
            value: e.id
          }))}
          value={trackingId}
          onChange={propertyCheckingId => {
            propertyCheckingId && setTrackingId(propertyCheckingId)
          }}
        />
      </label>

      {/* <label className='flex cursor-pointer items-center justify-center gap-1 rounded'>
        <p className='ml-1'>Sort by:</p>
        <Select
          classNames={{
            input:
              'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px] h-[30px]',
            dropdown: '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
            option: 'hover:bg-gray-700/90'
          }}
          className='w-32'
          value={sortBy}
          data={[
            { label: 'Label', value: 'label' },
            { label: 'Created at', value: 'createdAt' },
            { label: 'Updated at', value: 'updatedAt' }
          ]}
          onChange={propertyCheckingId =>
            propertyCheckingId && setSortBy(propertyCheckingId as any)
          }
        />
      </label> */}

      <Input
        className='flex h-[30px] items-center rounded bg-gray-400/20'
        size='sm'
        placeholder='Search card name'
        leftSection={<IconSearch size={14} />}
        classNames={{
          input: 'bg-transparent border-none min-h-[20px] h-[20px] text-gray-100',
        }}
        value={searchValue}
        onChange={e => setSearchValue(e.currentTarget.value)}
      />

      <ActionIcon
        variant='transparent'
        aria-label='Settings'
        className='h-[30px] w-[30px] bg-gray-400/20'
      >
        <IconFilter size={16} stroke={1.5} />
      </ActionIcon>
    </>
  )
}
