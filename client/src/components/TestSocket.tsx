import { useEffect } from 'react'
import { useSocket } from '../SocketProvider'

const YourComponent = () => {
  const { socket } = useSocket()
  const handleSendEvent = () => {
    const eventData = { message: 'Hello, server!' }
    socket?.emit('events', eventData) // Gửi sự kiện 'customEvent' với dữ liệu eventData
  }

  useEffect(() => {
    socket?.on('events', (data: any) => {
      console.log('Received event:', data)
    })
  }, [socket])

  return (
    <div>
      <button onClick={handleSendEvent}>Gửi sự kiện tới server</button>

      <button
        onClick={() => {
          socket?.emit('identity', 'sssbshshshshs.sssusssss')
        }}
      >
        Auth
      </button>
    </div>
  )
}

export default YourComponent
