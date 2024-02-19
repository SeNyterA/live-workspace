import { Divider } from '@mantine/core'
import { TeamMemberRoles } from './TeamMemberRoles'
import { useSetting } from './TeamSetting'
import { UsersStack } from './UsersSlack'

export default function MembersManager() {
  const { userSelected } = useSetting()

  return (
    <div className='flex h-full w-full gap-4'>
      <UsersStack />

      {!!userSelected && (
        <>
          <Divider variant='dashed' orientation='vertical' />
          <TeamMemberRoles />
        </>
      )}
    </div>
  )
}
