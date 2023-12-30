import { ActionIcon, Divider, Input } from '@mantine/core'
import { IconChevronRight, IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../hooks/useAppParams'
import { TMessages, workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppQuery } from '../../services/apis/useAppQuery'
import { useAppOnSocket } from '../../services/socket/useAppOnSocket'
import { EMessageFor } from '../../types/workspace.type'
import Info from './info/Info'
import InfoProvier from './info/InfoProvier'
import MessageContent from './MessageContent'
import MessageContentProvider from './MessageContentProvider'
import SendMessage from './SendMessage'

export default function GroupMessage() {
  const [openInfo, setOpenInfo] = useState(false)
  const dispatch = useDispatch()
  const { groupId } = useAppParams()

  useAppOnSocket({
    key: 'message',
    resFunc: ({ message }) => {
      dispatch(workspaceActions.addMessages({ [message._id]: message }))
    }
  })

  const group = useAppSelector(state =>
    Object.values(state.workspace.groups).find(e => e._id === groupId)
  )
  const { data: groupMessages } = useAppQuery({
    key: 'groupMessages',
    url: {
      baseUrl: '/workspace/groups/:groupId/messages',
      urlParams: {
        groupId: groupId!
      }
    },
    options: {
      queryKey: [groupId],
      enabled: !!groupId
    }
  })

  useEffect(() => {
    if (groupMessages)
      dispatch(
        workspaceActions.addMessages(
          groupMessages?.messages.reduce(
            (pre, next) => ({ ...pre, [next._id]: next }),
            {} as TMessages
          )
        )
      )
  }, [groupMessages])

  return (
    <div className='flex flex-1'>
      <div className='flex flex-1 flex-col'>
        <div className='flex h-12 items-center gap-3 px-4'>
          <p className='flex-1 text-lg'>{group?.title}</p>
          <Input
            size='sm'
            placeholder='Search on group'
            leftSection={<IconSearch size={14} />}
            className='flex h-[30px] max-w-[270px] flex-1 items-center rounded bg-gray-100'
            classNames={{
              input: 'bg-transparent border-none min-h-[20px] h-[20px]'
            }}
          />

          <ActionIcon
            variant='light'
            className='h-[30px] w-[30px] bg-gray-100'
            onClick={() => setOpenInfo(e => !e)}
          >
            <IconChevronRight
              className={`h-4 w-4 transition-transform ${
                openInfo || 'rotate-180'
              }`}
            />
          </ActionIcon>
        </div>
        <Divider variant='dashed' />
        <MessageContentProvider
          value={{
            title: group?.title || '',
            targetId: {
              groupId
            }
          }}
        >
          <MessageContent
            key={JSON.stringify({
              targetId: {
                groupId
              }
            })}
          />
        </MessageContentProvider>
        <Divider variant='dashed' />
        <SendMessage targetId={groupId || ''} targetType={EMessageFor.Group} />
      </div>
      {openInfo && (
        <>
          <Divider orientation='vertical' variant='dashed' />
          <InfoProvier
            value={{
              title: group?.title || '',
              targetId: { groupId },
              type: 'group'
            }}
          >
            <Info />
          </InfoProvier>
        </>
      )}
    </div>
  )
}
