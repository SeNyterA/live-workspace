import { ActionIcon, Avatar, Select } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { useAppSelector } from '../../redux/store'
import { TMemberDto } from '../../types/dto.type'
import { EMemberRole } from '../../types/workspace.type'

const MemberControl = ({
  member,
  onChange,
  onRemove
}: {
  member: TMemberDto
  onChange?: (role: EMemberRole) => void
  onRemove?: () => void
}) => {
  const user = useAppSelector(state =>
    Object.values(state.workspace.users).find(e => e._id === member.userId)
  )

  return (
    <div
      className='mt-2 flex flex-1 items-center gap-2 first:mt-0'
      key={user?._id}
    >
      <Avatar src={user?.avatar} />
      <div className='flex flex-1 flex-col justify-center'>
        <p className='font-medium leading-5'>{user?.userName}</p>
        <p className='text-xs leading-3 text-gray-500'>{user?.email}</p>
      </div>
      <Select
        classNames={{
          input: 'border-gray-100'
        }}
        value={member.role}
        className='w-32'
        data={[EMemberRole.Member, EMemberRole.Admin, EMemberRole.Owner]}
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

export default MemberControl
