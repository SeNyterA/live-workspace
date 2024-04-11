import { MemberRole } from '@prisma/client'
import { Server } from 'socket.io'
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
  const userSockets = sockets.filter(socket => socket.rooms.has(userId))
  if (userSockets.length) return
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
  const userSockets = sockets.filter(socket => socket.rooms.has(userId))
  if (!userSockets.length) return
  userSockets.forEach(socket => {
    rooms.forEach(room => socket.leave(room))
  })
}
