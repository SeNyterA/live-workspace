import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import io, { Socket } from 'socket.io-client'

interface SocketProviderProps {
  children?: ReactNode
}

const socketContext = createContext<{ socket?: Socket<any, any> }>({})

export const useSocket = () => useContext(socketContext)
const key = Math.random()

export default function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket<any, any>>()

  useEffect(() => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlbnl0ZXJhQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoic2VueXRlcmEiLCJzdWIiOiI2NTIxMzA0OTFkMWU2MjFkMzRhMjUwZWMiLCJpYXQiOjE2OTY2NzUwMzgsImV4cCI6MTAwMDAxNjk2Njc1MDM3fQ.cicq_LbUe8Q7wnYRbOYvrue-ezVKljyBeruqNuHwtD8'

    const newSocket = io('http://localhost:8420', {
      auth: {
        token
      }
    }).connect()

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  )
}
