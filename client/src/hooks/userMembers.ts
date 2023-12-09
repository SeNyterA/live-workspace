// import { useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import { workspaceActions } from '../redux/slices/workspace.slice'
// import { useAppQuery } from '../services/apis/useAppQuery'
// import { TUser } from '../types/user.type'
// import { TMember } from '../types/workspace.type'

// export default function userMembers({
//   targetId,
//   includeUsers
// }: {
//   targetId: string | undefined
//   includeUsers?: boolean
// }) {
//   const dispatch = useDispatch()
//   const { data, ...rest } = useAppQuery({
//     key: 'targetMembers',
//     url: {
//       baseUrl: '/workspace/members/:targetId',
//       urlParams: {
//         targetId: targetId!
//       },
//       queryParams: {
//         includeUsers
//       }
//     },
//     options: {
//       enabled: !!targetId,
//       queryKey: [targetId]
//     }
//   })

//   useEffect(() => {
//     dispatch(
//       workspaceActions.addMembers({
//         members:
//           data?.members?.reduce(
//             (pre, next) => ({ ...pre, [next._id]: next }),
//             {} as { [memberId: string]: TMember }
//           ) || {},
//         users: data?.users?.reduce(
//           (pre, next) => ({ ...pre, [next._id]: next }),
//           {} as { [userId: string]: TUser }
//         )
//       })
//     )
//   }, [dispatch, data])

//   return {
//     data,
//     ...rest
//   }
// }
