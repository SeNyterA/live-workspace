import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import io, { Socket } from 'socket.io-client'
import { useAppSelector } from './redux/store'

interface SocketProviderProps {
  children?: ReactNode
}

const socketContext = createContext<{ socket?: Socket<any, any> }>({})

export const useSocket = () => useContext(socketContext)

export default function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket<any, any>>()
  const token = useAppSelector(state => state.auth.token)

  useEffect(() => {
    if (token) {
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
    }
  }, [token])

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  )
}
