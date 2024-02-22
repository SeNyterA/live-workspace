import { NavLink } from '@mantine/core'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { TWorkspace } from '../../../new-types/workspace'
import { useAppSelector } from '../../../redux/store'

export default function BoardItem({ board }: { board: TWorkspace }) {
  const { boardId } = useAppParams()
  const unreadCount = useAppSelector(
    state => state.workspace.unreadCount[board._id]
  )
  const { switchTo } = useAppControlParams()

  return (
    <NavLink
      classNames={{ label: 'truncate max-w-[220px] block flex-1' }}
      className='p-1 pl-3'
      label={
        <div className='flex items-center gap-2'>
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
