export * from '@prisma/client'
declare module 'socket.io' {
  interface Socket {
    _id: string
  }
  interface RemoteSocket {
    _id: string
  }
}
