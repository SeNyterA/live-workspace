import { Avatar, NavLink } from '@mantine/core'
import useAppControlParams from '../../../../../hooks/useAppControlParams'
import useAppParams from '../../../../../hooks/useAppParams'
import { useAppSelector } from '../../../../../redux/store'
import { TWorkspace } from '../../../../../types'

export default function BoardItem({ board }: { board: TWorkspace }) {
  const { boardId } = useAppParams()
  const unreadCount = useAppSelector(
    state => state.workspace.unreadCount[board._id]
  )
  const { switchTo } = useAppControlParams()

  return (
    <NavLink
      classNames={{ label: 'truncate max-w-[220px] block flex-1' }}
      className='p-1 pl-1'
      label={
        <div className='flex items-center gap-2'>
          <Avatar
            className='rounded'
            size={20}
            src={
              'https://s3.ap-southeast-1.amazonaws.com/liveworkspace.senytera/1709031245746_ca114960-a6a3-4acd-8b63-02f5a9155ed0_wallpapersden.com_stitched_woman_face_wxl.jpg'
            }
          />
          <span className='flex-1 truncate'>{board.title || board._id}</span>
          {unreadCount && (
            <span className='h-4 min-w-4 rounded-full bg-gray-300 px-1 text-center text-xs leading-4 text-gray-800'>
              {unreadCount}
            </span>
          )}
        </div>
      }
      active={boardId === board._id}
      onClick={() => {
        switchTo({
          target: 'board',
          targetId: board._id
        })
      }}
    />
  )
}
