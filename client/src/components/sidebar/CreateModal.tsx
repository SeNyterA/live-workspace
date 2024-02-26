import {
  Avatar,
  Button,
  Input,
  LoadingOverlay,
  Modal,
  ScrollArea
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch, IconSend } from '@tabler/icons-react'
import { useState } from 'react'
import useAppControlParams from '../../hooks/useAppControlParams'
import { useAppQuery } from '../../services/apis/useAppQuery'

export default function CreateModal({
  onClose,
  isOpen
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [searchValue, setSearchValue] = useState('')
  const [keyword] = useDebouncedValue(searchValue, 200)
  const { switchTo } = useAppControlParams()
  const { data, isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users/by-keyword',
      queryParams: {
        keyword
      }
    }
  })

  return (
    <Modal
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create direct channel</p>}
    >
      <Input
        placeholder='username, email, nickname ...'
        leftSection={<IconSearch size={16} />}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
      <div className='relative mt-3 h-80'>
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <ScrollArea className='absolute inset-0' scrollbarSize={8}>
          {data?.users.map(user => (
            <div className='mt-3 flex flex-1 gap-2 first:mt-0' key={user._id}>
              <Avatar src={user.avatar?.path} />
              <div className='flex flex-1 flex-col justify-center'>
                <p className='font-medium leading-5'>{user.userName}</p>
                <p className='text-xs leading-3 text-gray-500'>{user.email}</p>
              </div>
              <Button
                variant='light'
                size='compact-sm'
                onClick={() => {
                  switchTo({
                    target: 'direct-message',
                    targetId: user.userName
                  })
                  onClose()
                }}
              >
                <IconSend />
              </Button>
            </div>
          ))}
        </ScrollArea>
      </div>
    </Modal>
  )
}
