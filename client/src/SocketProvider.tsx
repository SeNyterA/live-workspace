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

export default function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket<any, any>>()

  useEffect(() => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNlbnl0ZXJhQGdtYWlsLmNvbSIsInVzZXJOYW1lIjoic2VueXRlcmEiLCJzdWIiOiI2NTJmNGVhZWQxYzFlMDg2YThiZTIxZTEiLCJpYXQiOjE2OTc1OTkyMzAsImV4cCI6MTAwMDAxNjk3NTk5MjI5fQ.Vhyw6ZPRT8nkImRBbmSnY4bdlGDtTjLTV_1UKF2kmHo'

    const newSocket = io('http://localhost:8420', {
      auth: {
        token
      }
    }).connect()

    newSocket.emit('joins')

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
