import { Fragment } from 'react'
import { useLayout } from '../../../Layout'
import { useAppSelector } from '../../../redux/store'
import { groupMessages } from '../MessageContentProvider'
import MessageGroup from '../MessageGroup'
import SendMessage from '../SendMessage'
import { ScrollArea } from '@mantine/core'

export default function Thread() {
  const { thread } = useLayout()
  const threadMessages = useAppSelector(state =>
    Object.values(state.workspace.messages).filter(
      m => m._id === thread?.threadId || m.replyRootId === thread?.threadId
    )
  )
  console.log({ threadMessages })
  if (!thread) return <Fragment />

  return (
    <div className='flex w-full max-w-96 flex-col pt-3'>
      <div className='flex-1 relative'>
        <ScrollArea className='absolute inset-0'>
        {groupMessages(threadMessages || []).map(groupMessage => (
          <MessageGroup
            key={groupMessage.messages[0]._id}
            messageGroup={groupMessage}
          />
        ))}
        </ScrollArea>
      </div>
      <SendMessage
        targetId={thread.targetId}
        targetType={thread.targetType}
        thread={thread}
      />
    </div>
  )
}
