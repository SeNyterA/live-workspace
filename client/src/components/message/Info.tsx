import { Divider, NavLink } from '@mantine/core'
import { useAppSelector } from '../../redux/store'
import { TMessageContentValue } from './MessageContentProvider'

export default function Info({
  targetId: { channelId, directId, groupId },
  title
}: Pick<TMessageContentValue, 'targetId' | 'title' | 'userTargetId'>) {
  const members = useAppSelector(state => {
    const members = Object.values(state.workspace.members)
    const users = Object.values(state.workspace.users)
    const directs = Object.values(state.workspace.directs)



    if (channelId || groupId) {
      const _members = members.filter(
        e => e.targetId === (channelId || groupId)
      )
      console.log(_members)

      return _members.map(member => ({
        member: _members,
        user: users.find(e => e._id === member.userId)
      }))
    }

    if (directId) {
      const _direct = directs.find(e => e._id === directId)
      return {
        direct: _direct,
        users: users.filter(user => _direct?.userIds.includes(user._id))
      }
    }
  })

  console.log({ members })

  return (
    <div className='flex w-72 flex-col py-3'>
      <p className='px-4 text-base'>{title}</p>
      <p className='px-4 text-xs text-gray-500'>
        id: {channelId || directId || groupId}
      </p>
      <Divider variant='dashed' className='mx-4 my-2' />
      <div className='relative flex-1 px-4'>
        <NavLink
          className='p-1 pl-0 opacity-70'
          label='Members'
          onClick={() => {}}
        >
          <div className='h-16' />
        </NavLink>
      </div>
    </div>
  )
}
