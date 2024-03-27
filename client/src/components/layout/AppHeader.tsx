import { Modal } from '@mantine/core'
import { useState } from 'react'
import { useAppSelector } from '../../redux/store'
import UserAvatar from '../common/UserAvatar'
import Notification from './Notification'
import SettingProfile from './SettingProfile'

export default function AppHeader() {
  const user = useAppSelector(state => state.auth.userInfo)
  const [settingProfile, setSettingProfile] = useState(false)
  return (
    <div className='flex h-12 items-center gap-3 bg-black/80 px-3'>
      <p className='text-xl font-semibold'>Live workspace - Senytera</p>
      <div className='flex flex-1 items-center justify-center'></div>
      <Notification />
      <UserAvatar
        user={user}
        isSetting={true}
        onOpenSettingProfile={() => {
          setSettingProfile(true)
        }}
      />
      <Modal
        opened={settingProfile}
        onClose={() => {
          setSettingProfile(false)
        }}
        overlayProps={{
          blur: '0.5'
        }}
        classNames={{
          header: 'bg-transparent',
          content: 'rounded-lg flex flex-col bg-black/80',
          inner: 'p-3',
          body: 'flex flex-col flex-1 relative text-sm',
          root: 'text-gray-100',
          overlay: 'bg-white/10 blur'
        }}
        // centered
        size={376}
        title={
          <div className='flex items-center justify-center gap-1 text-lg'>
            Profile setting
          </div>
        }
      >
        <SettingProfile />
      </Modal>
    </div>
  )
}
