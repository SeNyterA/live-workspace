import { ActionIcon, Avatar, Select } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { memo } from 'react'
import { useAppSelector } from '../../../redux/store'
import Watching from '../../../redux/Watching'
import { EMemberRole, TMember } from '../../../types'

const MemberControl = ({
  member,
  onChange,
  onRemove
}: {
  member: TMember
  onChange?: (role: EMemberRole) => void
  onRemove?: () => void
}) => {
  const user = useAppSelector(state =>
    Object.values(state.workspace.users).find(e => e.id === member.userId)
  )

  return (
    <div
      className='mt-2 flex flex-1 items-center gap-2 first:mt-0'
      key={user?.id}
    >
      <Watching watchingFn={state => state.workspace.files[user?.avatarId!]}>
        {data => <Avatar src={data?.path} size={32} />}
      </Watching>

      <div className='flex max-w-[145px] flex-1 flex-col justify-center'>
        <p className='truncate font-medium leading-5'>{user?.userName}</p>
        <p className='truncate text-xs leading-3 text-gray-500'>
          {user?.email}
        </p>
      </div>
      <Select
        classNames={{
          input: 'border-gray-100 border-none bg-gray-100 min-h-[30px] h-[30px]'
        }}
        value={member.role}
        className='w-32'
        data={[EMemberRole.Member, EMemberRole.Admin]}
        onChange={role => role && onChange && onChange(role as EMemberRole)}
      />
      <ActionIcon
        className='h-[30px] w-[30px] bg-gray-100 text-black'
        variant='transparent'
        onClick={onRemove}
      >
        <IconX size={12} />
      </ActionIcon>
    </div>
  )
}

export default memo(MemberControl)
