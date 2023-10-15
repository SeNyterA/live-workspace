import { useEffect } from 'react'
import { useSocket } from '../SocketProvider'

const YourComponent = () => {
  const { socket } = useSocket()

  useEffect(() => {
    socket?.on('createdTeam', (data: any) => {
      console.log('Received event:', data)
    })
  }, [socket])

  return (
    <div className='w-full h-full items-center justify-center flex gap-3 flex-wrap'>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-3'>
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
        </div>

        <div className='flex gap-2'>
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

        <div className='flex gap-2'>
          <button
            className='bg-gray-100 px-3 py-1.5 rounded'
            onClick={() => {
              socket?.emit('startTyping', 'target_10')
            }}
          >
            Typing 10
          </button>

          <button
            className='bg-gray-100 px-3 py-1.5 rounded'
            onClick={() => {
              socket?.emit('startTyping', 'target_11')
            }}
          >
            Typing 11
          </button>

          <button
            className='bg-gray-100 px-3 py-1.5 rounded'
            onClick={() => {
              socket?.emit('startTyping', 'target_12')
            }}
          >
            Typing 12
          </button>
        </div>
      </div>
    </div>
  )
}

export default YourComponent
