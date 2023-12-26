import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import io, { Socket } from 'socket.io-client'
import { useAppSelector } from '../../redux/store'
import { baseURL } from '../config'

interface SocketProviderProps {
  children?: ReactNode
}

const socketContext = createContext<{ socket?: Socket<any, any> }>({})

export const useSocketContext = () => useContext(socketContext)

export default function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket<any, any>>()
  const token = useAppSelector(state => state.auth.token)
  console.log({ baseURL })
  useEffect(() => {
    if (token) {
      const newSocket = io(baseURL!, {
        auth: {
          token
        }
      }).connect()

      // newSocket.emit('joins')

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
