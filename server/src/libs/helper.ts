import { MemberRole, MemberStatus } from '@prisma/client'
import { Server } from 'socket.io'
import { PrismaService } from 'src/modules/prisma/prisma.service'
export declare type JSONContent = {
  type?: string
  attrs?: Record<string, any>
  content?: JSONContent[]
  marks?: {
    type: string
    attrs?: Record<string, any>
    [key: string]: any
  }[]
  text?: string
  [key: string]: any
}

export const getListUserMentionIds = (data: JSONContent): string[] => {
  const result: string[] = []

  const traverse = (node: JSONContent) => {
    if (node.type === 'mention') {
      result.push(node.attrs?.id)
    }

    if (node.content) {
      for (const child of node.content) {
        traverse(child)
      }
    }
  }

  traverse(data)

  return result
}

export const RoleWeights = {
  // [MemberRole.Owner]: 4,
  [MemberRole.Admin]: 3,
  [MemberRole.Member]: 2
}

export const checkPermission = async ({
  operatorRole,
  targetRole = MemberRole.Member
}: {
  operatorRole: MemberRole
  targetRole?: MemberRole
}) => {
  if (
    RoleWeights[operatorRole] >= RoleWeights[targetRole] &&
    RoleWeights[operatorRole] > RoleWeights[MemberRole.Member]
  ) {
    return true
  }
  return false
}

export const joinRooms = async ({
  rooms,
  server,
  userId
}: {
  server: Server
  userId: string
  rooms: string[] | string
}) => {
  const sockets = await server.fetchSockets()
  const userSockets = sockets.filter(socket => socket._id === userId)
  if (!userSockets.length) return
  userSockets.forEach(socket => {
    socket.join(rooms)
  })
}

export const leaveRooms = async ({
  rooms,
  server,
  userId
}: {
  server: Server
  userId: string
  rooms: string[]
}) => {
  const sockets = await server.fetchSockets()
  const userSockets = sockets.filter(socket => socket._id === userId)
  if (!userSockets.length) return
  userSockets.forEach(socket => {
    rooms.forEach(room => socket.leave(room))
  })
}

export const membersJoinRoomWhenCreateWorkspace = async ({
  workspaceId,
  workspace,
  prismaService,
  server
}: {
  workspaceId: string
  workspace: any
  server: Server
  prismaService: PrismaService
}) => {
  const members = await prismaService.member.findMany({
    where: {
      workspaceId: workspaceId,
      status: MemberStatus.Active
    }
  })

  const membersId = members.map(member => member.userId)
  const socket = await server.sockets.fetchSockets()
  socket.map(socket => {
    if (membersId.includes(socket._id)) {
      console.log('join workspace', workspaceId)
      return socket.join(workspaceId)
    }
  })

  setTimeout(() => {
    server.to(workspaceId).emit('workspace', { workspace: workspace })
  }, 0)
}
