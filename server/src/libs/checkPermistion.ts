import { EMemberRole } from 'src/modules/workspace/member/member.schema'

type TPermissionsBase = {
  type: 'channel' | 'group' | 'team' | 'board'
  update: boolean
  delete: boolean
  leave: boolean
  memberAction: {
    add: EMemberRole[]
    delete: EMemberRole[]
    toggleRole: EMemberRole[]
  }
}

type TTeamPermissions = TPermissionsBase & {
  type: 'team'
  createChannel: boolean
  createBoard: boolean
}

type TChannelPermissions = TPermissionsBase & {
  type: 'channel'
  switchChannelType: boolean
}

type TGroupPermissions = TPermissionsBase & {
  type: 'group'
}

type TBoardPermissions = TPermissionsBase & {
  type: 'board'
  cardAction: {
    create: EMemberRole[]
    edit: EMemberRole[]
    delete: EMemberRole[]
  }
  fieldAction: {
    create: EMemberRole[]
    edit: EMemberRole[]
    delete: EMemberRole[]
  }
}

export const getTeamPermission = (role: EMemberRole): TTeamPermissions => {
  switch (role) {
    case EMemberRole.Owner:
      return {
        type: 'team',
        delete: true,
        update: true,
        leave: true,
        createBoard: true,
        createChannel: true,
        memberAction: {
          add: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          toggleRole: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        }
      }
    case EMemberRole.Admin:
      return {
        type: 'team',
        delete: false,
        update: true,
        leave: true,
        createBoard: true,
        createChannel: true,
        memberAction: {
          add: [EMemberRole.Admin, EMemberRole.Member],
          delete: [EMemberRole.Admin, EMemberRole.Member],
          toggleRole: [EMemberRole.Admin, EMemberRole.Member]
        }
      }

    default:
      return {
        type: 'team',
        delete: false,
        update: false,
        leave: true,
        createBoard: false,
        createChannel: false,
        memberAction: {
          add: [],
          delete: [],
          toggleRole: []
        }
      }
  }
}

export const getChannelPermission = (
  role: EMemberRole
): TChannelPermissions => {
  switch (role) {
    case EMemberRole.Owner:
      return {
        type: 'channel',
        delete: true,
        update: true,
        leave: true,
        switchChannelType: true,
        memberAction: {
          add: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          toggleRole: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        }
      }
    case EMemberRole.Admin:
      return {
        type: 'channel',
        delete: true,
        update: true,
        leave: true,
        switchChannelType: true,
        memberAction: {
          add: [EMemberRole.Admin, EMemberRole.Member],
          delete: [EMemberRole.Admin, EMemberRole.Member],
          toggleRole: [EMemberRole.Admin, EMemberRole.Member]
        }
      }

    default:
      return {
        type: 'channel',
        delete: false,
        update: false,
        leave: true,
        switchChannelType: false,
        memberAction: {
          add: [],
          delete: [],
          toggleRole: []
        }
      }
  }
}

export const getGroupPermission = (role: EMemberRole): TGroupPermissions => {
  switch (role) {
    case EMemberRole.Owner:
      return {
        type: 'group',
        delete: true,
        update: true,
        leave: true,
        memberAction: {
          add: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          toggleRole: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        }
      }
    case EMemberRole.Admin:
      return {
        type: 'group',
        update: true,
        leave: true,
        delete: false,
        memberAction: {
          add: [EMemberRole.Admin, EMemberRole.Member],
          delete: [EMemberRole.Admin, EMemberRole.Member],
          toggleRole: [EMemberRole.Admin, EMemberRole.Member]
        }
      }

    default:
      return {
        type: 'group',
        update: false,
        leave: true,
        delete: false,
        memberAction: {
          add: [],
          delete: [],
          toggleRole: []
        }
      }
  }
}

export const getBoardPermission = (role?: EMemberRole): TBoardPermissions => {
  switch (role) {
    case EMemberRole.Owner:
      return {
        type: 'board',
        delete: true,
        update: true,
        leave: true,
        cardAction: {
          create: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          edit: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        },
        fieldAction: {
          create: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          edit: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        },
        memberAction: {
          add: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          toggleRole: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        }
      }
    case EMemberRole.Admin:
      return {
        type: 'board',
        delete: true,
        update: true,
        leave: true,
        cardAction: {
          create: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          edit: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        },
        fieldAction: {
          create: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          edit: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        },
        memberAction: {
          add: [EMemberRole.Admin, EMemberRole.Member],
          delete: [EMemberRole.Admin, EMemberRole.Member],
          toggleRole: [EMemberRole.Admin, EMemberRole.Member]
        }
      }
    case EMemberRole.Member:
      return {
        type: 'board',
        delete: false,
        update: false,
        leave: true,
        cardAction: {
          create: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          edit: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        },
        fieldAction: {
          create: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          delete: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner],
          edit: [EMemberRole.Admin, EMemberRole.Member, EMemberRole.Owner]
        },
        memberAction: {
          add: [],
          delete: [],
          toggleRole: []
        }
      }

    default:
      return {
        type: 'board',
        delete: false,
        update: false,
        leave: false,
        cardAction: {
          create: [],
          delete: [],
          edit: []
        },
        fieldAction: {
          create: [],
          delete: [],
          edit: []
        },
        memberAction: {
          add: [],
          delete: [],
          toggleRole: []
        }
      }
  }
}
