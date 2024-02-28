import { Divider } from '@mantine/core'
import { useSetting } from './TeamSetting'
import { UsersStack } from './UsersSlack'

export default function MembersManager() {
  const { userSelected } = useSetting()

  return (
    <div className='flex h-full w-full gap-4'>
      <UsersStack />
    </div>
  )
}
