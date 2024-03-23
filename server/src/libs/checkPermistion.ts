// import { MemberRole } from 'src/entities/member.entity'

// type TPermissionsBase = {
//   type: 'channel' | 'group' | 'team' | 'board'
//   view: boolean
//   update: boolean
//   delete: boolean
//   leave: boolean
//   memberAction: {
//     add: MemberRole[]
//     delete: MemberRole[]
//     toggleRole: MemberRole[]
//   }
// }

// type TTeamPermissions = TPermissionsBase & {
//   type: 'team'
//   createChannel: boolean
//   createBoard: boolean
// }

// type TChannelPermissions = TPermissionsBase & {
//   type: 'channel'
//   switchChannelType: boolean
// }

// type TGroupPermissions = TPermissionsBase & {
//   type: 'group'
// }

// type TBoardPermissions = TPermissionsBase & {
//   type: 'board'
//   cardAction: {
//     create: MemberRole[]
//     edit: MemberRole[]
//     delete: MemberRole[]
//   }
//   fieldAction: {
//     create: MemberRole[]
//     edit: MemberRole[]
//     delete: MemberRole[]
//   }
// }

// export const getTeamPermission = (role?: MemberRole): TTeamPermissions => {
//   switch (role) {
//     case MemberRole.Owner:
//       return {
//         type: 'team',
//         view: true,
//         delete: true,
//         update: true,
//         leave: true,
//         createBoard: true,
//         createChannel: true,
//         memberAction: {
//           add: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           toggleRole: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         }
//       }
//     case MemberRole.Admin:
//       return {
//         type: 'team',
//         view: true,
//         delete: false,
//         update: true,
//         leave: true,
//         createBoard: true,
//         createChannel: true,
//         memberAction: {
//           add: [MemberRole.Admin, MemberRole.Member],
//           delete: [MemberRole.Admin, MemberRole.Member],
//           toggleRole: [MemberRole.Admin, MemberRole.Member]
//         }
//       }

//     default:
//       return {
//         type: 'team',
//         view: true,
//         delete: false,
//         update: false,
//         leave: true,
//         createBoard: false,
//         createChannel: false,
//         memberAction: {
//           add: [],
//           delete: [],
//           toggleRole: []
//         }
//       }
//   }
// }

// export const getChannelPermission = (
//   role?: MemberRole
// ): TChannelPermissions => {
//   switch (role) {
//     case MemberRole.Owner:
//       return {
//         type: 'channel',
//         delete: true,
//         view: true,
//         update: true,
//         leave: true,
//         switchChannelType: true,
//         memberAction: {
//           add: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           toggleRole: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         }
//       }
//     case MemberRole.Admin:
//       return {
//         type: 'channel',
//         view: true,
//         delete: true,
//         update: true,
//         leave: true,
//         switchChannelType: true,
//         memberAction: {
//           add: [MemberRole.Admin, MemberRole.Member],
//           delete: [MemberRole.Admin, MemberRole.Member],
//           toggleRole: [MemberRole.Admin, MemberRole.Member]
//         }
//       }

//     case MemberRole.Member:
//       return {
//         type: 'channel',
//         delete: false,
//         view: true,
//         update: false,
//         leave: true,
//         switchChannelType: false,
//         memberAction: {
//           add: [],
//           delete: [],
//           toggleRole: []
//         }
//       }

//     default:
//       return {
//         type: 'channel',
//         delete: false,
//         view: true,
//         update: false,
//         leave: true,
//         switchChannelType: false,
//         memberAction: {
//           add: [],
//           delete: [],
//           toggleRole: []
//         }
//       }
//   }
// }

// export const getGroupPermission = (role?: MemberRole): TGroupPermissions => {
//   switch (role) {
//     case MemberRole.Owner:
//       return {
//         type: 'group',
//         view: true,
//         delete: true,
//         update: true,
//         leave: true,
//         memberAction: {
//           add: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           toggleRole: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         }
//       }
//     case MemberRole.Admin:
//       return {
//         type: 'group',
//         view: true,
//         update: true,
//         leave: true,
//         delete: false,
//         memberAction: {
//           add: [MemberRole.Admin, MemberRole.Member],
//           delete: [MemberRole.Admin, MemberRole.Member],
//           toggleRole: [MemberRole.Admin, MemberRole.Member]
//         }
//       }
//     case MemberRole.Member:
//       return {
//         type: 'group',
//         view: true,
//         update: false,
//         leave: true,
//         delete: false,
//         memberAction: {
//           add: [],
//           delete: [],
//           toggleRole: []
//         }
//       }

//     default:
//       return {
//         type: 'group',
//         view: false,
//         update: false,
//         leave: false,
//         delete: false,
//         memberAction: {
//           add: [],
//           delete: [],
//           toggleRole: []
//         }
//       }
//   }
// }

// export const getBoardPermission = (role?: MemberRole): TBoardPermissions => {
//   switch (role) {
//     case MemberRole.Owner:
//       return {
//         type: 'board',
//         view: true,
//         delete: true,
//         update: true,
//         leave: true,
//         cardAction: {
//           create: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           edit: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         },
//         fieldAction: {
//           create: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           edit: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         },
//         memberAction: {
//           add: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           toggleRole: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         }
//       }
//     case MemberRole.Admin:
//       return {
//         type: 'board',
//         view: true,
//         delete: true,
//         update: true,
//         leave: true,
//         cardAction: {
//           create: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           edit: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         },
//         fieldAction: {
//           create: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           edit: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         },
//         memberAction: {
//           add: [MemberRole.Admin, MemberRole.Member],
//           delete: [MemberRole.Admin, MemberRole.Member],
//           toggleRole: [MemberRole.Admin, MemberRole.Member]
//         }
//       }
//     case MemberRole.Member:
//       return {
//         type: 'board',
//         view: true,
//         delete: false,
//         update: false,
//         leave: true,
//         cardAction: {
//           create: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           edit: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         },
//         fieldAction: {
//           create: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           delete: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner],
//           edit: [MemberRole.Admin, MemberRole.Member, MemberRole.Owner]
//         },
//         memberAction: {
//           add: [],
//           delete: [],
//           toggleRole: []
//         }
//       }

//     default:
//       return {
//         type: 'board',
//         view: false,
//         delete: false,
//         update: false,
//         leave: false,
//         cardAction: {
//           create: [],
//           delete: [],
//           edit: []
//         },
//         fieldAction: {
//           create: [],
//           delete: [],
//           edit: []
//         },
//         memberAction: {
//           add: [],
//           delete: [],
//           toggleRole: []
//         }
//       }
//   }
// }
