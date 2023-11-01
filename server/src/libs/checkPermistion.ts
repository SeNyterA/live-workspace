import { EMemberRole } from 'src/modules/workspace/member/member.schema'

type TPermissions = {
  update?: boolean
  delete?: boolean
  switchChannelType?: boolean
  leave?: boolean
  createChannel?: boolean
  createBoard?: boolean
  memberAction?: {
    add?: EMemberRole[]
    delete?: EMemberRole[]
    toggleRole?: EMemberRole[]
  }
}

export const getTeamPermission = (role: EMemberRole): TPermissions => {
  switch (role) {
    case EMemberRole.Owner:
      return {
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
        leave: true
      }
  }
}

export const getChannelPermission = (role: EMemberRole): TPermissions => {
  switch (role) {
    case EMemberRole.Owner:
      return {
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
        leave: true
      }
  }
}

export const getGroupPermission = (role: EMemberRole): TPermissions => {
  switch (role) {
    case EMemberRole.Owner:
      return {
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
        leave: true
      }
  }
}
