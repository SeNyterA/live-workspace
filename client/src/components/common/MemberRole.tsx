import { Badge } from '@mantine/core'
import { EMemberRole } from '../../types'

export default function MemberRole({ role }: { role: EMemberRole }) {
  const getRoleColor = (role: EMemberRole) => {
    switch (role) {
      case EMemberRole.Owner:
        return 'green'
      case EMemberRole.Admin:
        return 'red'
      default:
        return 'gray'
    }
  }
  return (
    <Badge
      variant='light'
      color={getRoleColor(role)}
      radius='xs'
      className='w-16 px-0'
    >
      {role}
    </Badge>
  )
}
