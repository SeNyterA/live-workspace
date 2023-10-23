import { Avatar } from '@mantine/core'

type TStatus = 'online' | 'offline' | 'unknown'

export const UserInfo = ({ status = 'unknown' }: { status?: TStatus }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'offline':
        return 'bg-gray-200'
      case 'online':
        return 'bg-yellow-400'
      default:
        return 'bg-white'
    }
  }

  const statusColor = getStatusColor()

  return (
    <div className='flex w-full cursor-pointer items-center gap-1 rounded-md p-1 hover:bg-gray-100 mt-2 first:mt-0'>
      <div className='relative flex h-8 w-8 items-center justify-center overflow-visible rounded-full bg-slate-200'>
        <Avatar />
        <div
          className={`absolute bottom-[-1px] right-[-1px] h-3 w-3 rounded-full border border-gray-300 ${statusColor}`}
        />
      </div>

      <div className='flex flex-1 flex-col justify-center'>
        <p className='leading-4'>Nguyễn Đức Khang</p>
        <p className='text-xs leading-4 text-gray-500'>@Senytera</p>
      </div>
    </div>
  )
}

export default function MemberContent() {
  return (
    <>
      {Array(10)
        .fill(1)
        .map((_, index) => (
          <UserInfo key={index} status='online' />
        ))}
    </>
  )
}
