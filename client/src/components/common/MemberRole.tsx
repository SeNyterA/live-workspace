import { Badge } from '@mantine/core'
import { EMemberRole, EMemberStatus, TMember } from '../../types'

export default function MemberRole({ member }: { member: TMember }) {
  const getRoleColor = (role: EMemberRole) => {
    if (member.status === EMemberStatus.Active)
      switch (role) {
        case EMemberRole.Admin:
          return {
            color: 'red',
            title: 'Admin'
          }
        default:
          return {
            color: 'blue',
            title: 'Member'
          }
      }
    if (member.status === EMemberStatus.Invited) {
      return {
        color: 'gray',
        title: 'Invited'
      }
    }
    if ([EMemberStatus.Kicked, EMemberStatus.Leaved].includes(member.status)) {
      return {
        color: 'gray',
        title: 'Leaved'
      }
    }
  }
  return (
    <Badge
      radius='xs'
      color={getRoleColor(member.role)?.color}
      className={`w-16 px-0`}
    >
      {getRoleColor(member.role)?.title}
    </Badge>
  )
}
