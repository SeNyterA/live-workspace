import { Avatar, CloseButton, Input, Modal } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'

export default function AddTeamMember() {
  const [searchValue, setSearchValue] = useState('')
  const [keyword] = useDebouncedValue(searchValue, 500)
  const { teamId } = useAppParams()
  const members = useAppSelector(e =>
    Object.values(e.workspace.members).filter(
      member => member.targetId === teamId
    )
  )

  const { data, isLoading } = useAppQuery({
    key: 'findUsersByKeyword',
    url: {
      baseUrl: '/users',
      queryParams: {
        keyword
      }
    }
  })

  return (
    <Modal
      opened={true}
      onClose={() => {}}
      title={<p className='text-lg font-semibold'>Member manager</p>}
    >
      <Input
        size='sm'
        leftSection={<IconSearch size={16} />}
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder='Members search'
        rightSection={
          <CloseButton
            aria-label='Clear input'
            onClick={() => setSearchValue('')}
            style={{ display: searchValue ? undefined : 'none' }}
          />
        }
      />
      <div>
        {data?.users.map(user => (
          <div className='flex flex-1 gap-2'>
            <Avatar src={user.avatar} />
            <div className='flex flex-col justify-center'>
              <p className='font-medium leading-5'>{user.userName}</p>
              <p className='text-xs leading-3 text-gray-500'>{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
