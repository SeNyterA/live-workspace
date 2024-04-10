import { ActionIcon, Input, Select } from '@mantine/core'
import { IconSearch, IconSettings } from '@tabler/icons-react'
import { useState } from 'react'
import { useAppSelector } from '../../../redux/store'
import { EPropertyType } from '../../../types'
import { useBoard } from './BoardProvider'
import SettingProperty from './card/SettingProperty'

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
        [EPropertyType.Person, EPropertyType.Select].includes(property.type)
    )
  )

  const [openProperty, setOpenProperty] = useState(false)

  return (
    <>
      <p className='flex-1 text-base font-medium'>{board?.title}</p>
      <label className='flex cursor-pointer items-center justify-center gap-1 rounded'>
        <p className='ml-1'>Group by:</p>
        <Select
          checkIconPosition='right'
          classNames={{
            input: 'min-h-[30px] h-[30px]',
            dropdown: 'pr-0'
          }}
          className='max-w-32'
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

      <Input
        className='flex h-[30px] items-center rounded '
        size='sm'
        placeholder='Search card name'
        leftSection={<IconSearch size={14} />}
        classNames={{
          input: 'bg-transparent border-none min-h-[20px] h-[20px] '
        }}
        value={searchValue}
        onChange={e => setSearchValue(e.currentTarget.value)}
      />

      <ActionIcon
        aria-label='Settings'
        className='h-[30px] w-[30px] '
        onClick={() => setOpenProperty(true)}
      >
        <IconSettings size={16} stroke={1.5} />
      </ActionIcon>

      <SettingProperty
        opend={openProperty}
        onClose={() => setOpenProperty(false)}
      />
    </>
  )
}
