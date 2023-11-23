import {
  Avatar,
  Button,
  Drawer,
  LoadingOverlay,
  ScrollArea,
  Select,
  Textarea,
  TextInput
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { useAppQuery } from '../../services/apis/useAppQuery'

export default function CreateDirect({
  onClose,
  isOpen,
  refetchKey
}: {
  isOpen: boolean
  onClose: () => void
  refetchKey?: string
}) {
  const [searchValue, setSearchValue] = useState('')
  const [keyword] = useDebouncedValue(searchValue, 200)
  const { data, isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users/by-keyword',
      queryParams: {
        keyword
      }
    },
    options: {
      queryKey: [keyword],
      enabled: !!keyword
    }
  })

  return (
    <Drawer
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create direct</p>}
      overlayProps={{
        color: '#000',
        backgroundOpacity: 0.2,
        blur: 0.5
      }}
      classNames={{
        content: 'rounded-lg flex flex-col',
        inner: 'p-3',
        body: 'flex flex-col flex-1'
      }}
    >
      <TextInput
        label='Group name'
        placeholder='Your name'
        description='Leave it blank to use the names of the direct members...'
        size='sm'
      />

      <Textarea
        label='Group description'
        description='Description for the direct'
        placeholder='Anything...'
        className='mt-2'
      />

      <Select
        label='Group member'
        description='Description for the direct'
        placeholder='Username, email, nickname...'
        leftSection={<IconSearch size={16} />}
        limit={10}
        searchable
        searchValue={searchValue}
        onSearchChange={value => setSearchValue(value)}
        className='mt-2'
      />

      <div className='relative mt-3 flex-1'>
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <ScrollArea className='absolute inset-0' scrollbarSize={8}>
          {data?.users.map(user => (
            <div className='mt-3 flex flex-1 gap-2 first:mt-0' key={user._id}>
              <Avatar src={user.avatar} />
              <div className='flex flex-1 flex-col justify-center'>
                <p className='font-medium leading-5'>{user.userName}</p>
                <p className='text-xs leading-3 text-gray-500'>{user.email}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className='mt-2 flex items-center justify-end gap-3'>
        <Button variant='default' color='red'>
          Close
        </Button>
        <Button>Create</Button>
      </div>
    </Drawer>
  )
}
