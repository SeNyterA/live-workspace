import { Drawer } from '@mantine/core'
import { useState } from 'react'
import { useAppSelector } from '../../redux/store'
import UserAvatar from '../common/UserAvatar'
import Notification from './Notification'
import SettingProfile from './SettingProfile'

export default function AppHeader() {
  const user = useAppSelector(state => state.auth.userInfo)
  const [settingProfile, setSettingProfile] = useState(false)
  return (
    <div className='flex h-12 items-center gap-3 px-3'>
      <p className='text-xl font-semibold'>Live workspace</p>
      <div className='flex flex-1 items-center justify-center'></div>
      <Notification />
      <UserAvatar
        user={user}
        isSetting={true}
        onOpenSettingProfile={() => {
          setSettingProfile(true)
        }}
      />
      <Drawer
        opened={settingProfile}
        onClose={() => {
          setSettingProfile(false)
        }}
        position='right'
        size={376}
        title={
          <div className='flex items-center justify-center gap-1 text-lg'>
            Profile setting
          </div>
        }
        overlayProps={{
          blur: '0.5'
        }}
      >
        <SettingProfile />
      </Drawer>
    </div>
  )
}
