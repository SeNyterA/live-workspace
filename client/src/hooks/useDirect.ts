import { useAppSelector } from '../redux/store'

export default function useDirect(directId?: string) {
  const direct = useAppSelector(state => {
    const meId = state.auth.userInfo?._id!

    if (directId) {
      const existingDirect = Object.values(state.workspace.directs).find(
        ({ _id }) => _id === directId
      )

      if (existingDirect) {
        const targetUser = Object.values(state.workspace.users).find(
          user =>
            existingDirect.userIds.find(userId => userId !== meId) === user._id
        )

        return { direct: existingDirect, targetUser }
      }

      const _directUser = Object.values(state.workspace.users).find(
        ({ userName, email, _id }) => [userName, email, _id].includes(directId)
      )

      if (_directUser && _directUser._id !== meId) {
        const direct = Object.values(state.workspace.directs).find(
          ({ userIds }) => {
            return (
              Array.isArray(userIds) &&
              userIds.includes(meId) &&
              userIds.includes(_directUser._id)
            )
          }
        )
        if (direct) return { direct, targetUser: _directUser }
      }
    }
  })

  return direct
}
