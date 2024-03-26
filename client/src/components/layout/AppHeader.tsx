import { useAppSelector } from '../../redux/store'
import UserAvatar from '../common/UserAvatar'
import Notification from './Notification'

export default function AppHeader() {
  const user = useAppSelector(state => state.auth.userInfo)

  return (
    <div className='flex h-12 items-center gap-3 bg-black/80 px-3'>
      <p className='text-xl font-semibold'>Live workspace - Senytera</p>
      <div className='flex flex-1 items-center justify-center'></div>
      <Notification />
      <UserAvatar user={user} isSetting={true}/>
    </div>
  )
}
