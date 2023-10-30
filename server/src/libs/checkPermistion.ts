import { EMemberRole } from 'src/modules/workspace/member/member.schema'

export function checkPermission(
  operatorRole: EMemberRole,
  targetRole: EMemberRole
): boolean {
  if (operatorRole === EMemberRole.Owner) {
    return true
  }

  if (operatorRole === EMemberRole.Admin) {
    if (targetRole === EMemberRole.Owner) {
      return false
    }
    return true
  }

  if (operatorRole === EMemberRole.Member) {
    if (targetRole === EMemberRole.Owner || targetRole === EMemberRole.Admin) {
      return false
    }
    return true
  }

  return false
}
