import { useEffect } from 'react'
import { useAppSocket } from '../SocketProvider'

const YourComponent = () => {
  const { socket } = useAppSocket()

  useEffect(() => {
    socket?.on('createdTeam', (data: any) => {
      console.log('Received event:', data)
    })
    socket?.on('team', (data: any) => {
      console.log('Received event:', data)
    })
  }, [socket])

  return (
    <div className='flex h-full w-full flex-wrap items-center justify-center gap-3'>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-3'>
          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('joinTeam', '10')
              console.log('joinTeam', '10')
            }}
          >
            join team 10
          </button>

          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('joinTeam', '11')
              console.log('joinTeam', '11')
            }}
          >
            join team 11
          </button>
          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('joinTeam', '12')
              console.log('joinTeam', '12')
            }}
          >
            join team 12
          </button>
        </div>

        <div className='flex gap-2'>
          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('leaveTeam', '10')
              console.log('leaveTeam', '10')
            }}
          >
            leave team 10
          </button>

          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('leaveTeam', '11')
              console.log('leaveTeam', '11')
            }}
          >
            leave team 11
          </button>

          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('leaveTeam', '12')
              console.log('leaveTeam', '12')
            }}
          >
            leave team 12
          </button>
        </div>

        <div className='flex gap-2'>
          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('startTyping', 'target_10')
              console.log('startTyping', 'target_10')
            }}
          >
            Typing 10
          </button>

          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('startTyping', 'target_11')
              console.log('startTyping', 'target_11')
            }}
          >
            Typing 11
          </button>

          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('startTyping', 'target_12')
              console.log('startTyping', 'target_12')
            }}
          >
            Typing 12
          </button>
        </div>

        <div className='flex gap-2'>
          <button
            className='rounded bg-gray-100 px-3 py-1.5'
            onClick={() => {
              socket?.emit('joins')
              console.log('joins')
            }}
          >
            Joins
          </button>
        </div>
      </div>
    </div>
  )
}

export default YourComponent
