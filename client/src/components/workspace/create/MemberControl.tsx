import { ActionIcon, Avatar } from '@mantine/core'
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
      className='mt-2 flex flex-1 items-center gap-2 rounded bg-slate-200/5 p-2 first:mt-0'
      key={user?.id}
    >
      <Watching watchingFn={state => state.workspace.files[user?.avatarId!]}>
        {data => <Avatar src={data?.path} size={32} />}
      </Watching>

      <div className='flex flex-1 flex-col justify-center'>
        <p className='truncate font-medium leading-5'>{user?.userName}</p>
        <p className='truncate text-xs leading-3 text-gray-500'>
          {user?.email}
        </p>
      </div>

      <ActionIcon
        className='h-[30px] w-[30px] bg-gray-400/20'
        color='gray'
        variant='transparent'
        onClick={onRemove}
      >
        <IconX size={12} />
      </ActionIcon>
    </div>
  )
}

export default memo(MemberControl)
