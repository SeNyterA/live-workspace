import { useAppSelector } from '../../../redux/store'
import { EMemberStatus, RoleWeights } from '../../../types'

export default function useClassifyMember({
  searchValue
}: {
  searchValue: string
}) {
  const members = useAppSelector(state =>
    Object.values(state.workspace.members)
      .filter(
        member => member.workspaceId === state.workspace.workspaceSettingId
      )
      .map(member => ({
        ...member,
        user: state.workspace.users[member.userId]
      }))
      .sort((a, b) => RoleWeights[a.role] - RoleWeights[b.role])
      .filter(
        ({ user }) =>
          user?.userName?.includes(searchValue) ||
          user?.email?.includes(searchValue) ||
          user?.nickName?.includes(searchValue)
      )
  )
  return {
    members,
    activeMembers:
      members?.filter(
        member =>
          member.status === EMemberStatus.Active && member.user.isAvailable
      ) || [],
    invitedMembers:
      members?.filter(
        member =>
          member.status === EMemberStatus.Invited && member.user.isAvailable
      ) || [],
    blockedMembers:
      members?.filter(
        member =>
          [
            EMemberStatus.Declined,
            EMemberStatus.Kicked,
            EMemberStatus.Leaved
          ].includes(member.status) || !member.user.isAvailable
      ) || []
  }
}
