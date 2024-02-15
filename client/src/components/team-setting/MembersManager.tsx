import { Divider } from '@mantine/core'
import { InviteMember } from './InviteMember'
import { UsersStack } from './UsersSlack'

export default function MembersManager() {
  return (
    <div className='flex h-full w-full gap-4'>
      <UsersStack />
      <Divider variant='dashed' orientation='vertical' />
      <InviteMember />
    </div>
  )
}
