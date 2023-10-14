import { useEffect } from 'react'
import { useSocket } from '../SocketProvider'

const YourComponent = () => {
  const { socket } = useSocket()
  const handleSendEvent = () => {
    const eventData = { message: 'Hello, server!' }
    socket?.emit('events', eventData) // Gửi sự kiện 'customEvent' với dữ liệu eventData
  }

  useEffect(() => {
    socket?.on('createdTeam', (data: any) => {
      console.log('Received event:', data)
    })
  }, [socket])

  return (
    <div className='w-full h-full items-center justify-center flex gap-3 flex-wrap'>
      <button
        className='bg-gray-100 px-3 py-1.5 rounded'
        onClick={() => {
          socket?.emit('joinTeam', '10')
        }}
      >
        join team 10
      </button>

      <button
        className='bg-gray-100 px-3 py-1.5 rounded'
        onClick={() => {
          socket?.emit('joinTeam', '11')
        }}
      >
        join team 11
      </button>
      <button
        className='bg-gray-100 px-3 py-1.5 rounded'
        onClick={() => {
          socket?.emit('joinTeam', '12')
        }}
      >
        join team 12
      </button>

      <button
        className='bg-gray-100 px-3 py-1.5 rounded'
        onClick={() => {
          socket?.emit('leaveTeam', '10')
        }}
      >
        leave team 10
      </button>

      <button
        className='bg-gray-100 px-3 py-1.5 rounded'
        onClick={() => {
          socket?.emit('leaveTeam', '11')
        }}
      >
        leave team 11
      </button>

      <button
        className='bg-gray-100 px-3 py-1.5 rounded'
        onClick={() => {
          socket?.emit('leaveTeam', '12')
        }}
      >
        leave team 12
      </button>
    </div>
  )
}

export default YourComponent
