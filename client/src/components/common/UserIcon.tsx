import { Avatar, Indicator } from '@mantine/core'
import { useAppSelector } from '../../redux/store'
import { TUser } from '../../types'

export default function UserIcon({
  user,
  size = 36,
  zIndex = 1
}: {
  user?: TUser
  size?: number
  zIndex?: number
}) {
  const avatar = useAppSelector(state => state.workspace.files[user?.avatarId!])
  const presence = useAppSelector(state => state.workspace.presents[user?.id!])
  return (
    <Indicator
      inline
      size={12}
      offset={5}
      position='bottom-end'
      color={presence === 'online' ? 'green' : 'gray'}
      processing={presence === 'online'}
      zIndex={zIndex}
      disabled={!user || !presence}
      className='h-fit w-fit'
    >
      <Avatar src={avatar?.path} size={size}>
        <span className='capitalize'>{user?.userName[0]}</span>
      </Avatar>
    </Indicator>
  )
}
