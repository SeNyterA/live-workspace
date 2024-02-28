import { Divider, Modal, ScrollArea } from '@mantine/core'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { useAppEmitSocket } from '../../../services/socket/useAppEmitSocket'
import SendMessage from '../../message/SendMessage'
import Editor from '../description/Editor'
import CardTitle from './CardTitle'
import Properties from './Properties'

export default function DetailCard() {
  const { toogleCard } = useAppControlParams()
  const { cardId } = useAppParams()
  const card = useAppSelector(state =>
    Object.values(state.workspace.cards).find(e => e._id === cardId)
  )
  // const cardMessages = useAppSelector(state =>
  //   Object.values(state.workspace.messages).filter(
  //     e => e.replyRootId === cardId
  //   )
  // )

  const dispatch = useDispatch()
  const socketEmit = useAppEmitSocket()

  // const { data: cardMessagesApi } = useAppQuery({
  //   key: 'cardMessages',
  //   url: {
  //     baseUrl: '/workspace/boards/:boardId/cards/:cardId/messages',
  //     urlParams: {
  //       boardId: card?.boardId!,
  //       cardId: card?._id!
  //     }
  //   },
  //   options: {
  //     queryKey: [card?.boardId, card?._id],
  //     enabled: !!card?.boardId && !!card?._id
  //   }
  // })

  // useEffect(() => {
  //   dispatch(
  //     workspaceActions.addMessages(
  //       cardMessagesApi?.messages?.reduce(
  //         (pre, next) => ({ ...pre, [next._id]: next }),
  //         {} as TMessages
  //       ) || {}
  //     )
  //   )
  // }, [cardMessagesApi])

  const { mutateAsync: createChannelMessage } = useAppMutation(
    'createCardMessage',
    {
      mutationOptions: {
        onError(error, variables, context) {
          console.log('onError', {
            error,
            variables,
            context
          })
        },
        onMutate(variables) {
          console.log('onMutate', {
            variables
          })
        },
        onSettled(data, error, variables, context) {
          console.log('onSettled', {
            data,
            error,
            variables,
            context
          })
        },
        onSuccess(data, variables, context) {
          console.log('onSuccess', {
            data,
            variables,
            context
          })
        }
      }
    }
  )

  return (
    <>
      {!!cardId && !!card && (
        <Modal
          onClose={() => {
            toogleCard({})
          }}
          opened={true}
          title={<CardTitle />}
          size='100%'
          classNames={{
            content: 'h-full flex flex-col bg-gray-100 rounded-lg',
            body: 'flex-1',
            header: 'flex bg-transparent py-3',
            title: 'flex-1'
          }}
          overlayProps={{
            color: '#000',
            backgroundOpacity: 0.1,
            blur: 1
          }}
        >
          <div className='flex h-full gap-4'>
            <Properties />

            <div className='flex flex-1 flex-col overflow-hidden rounded-lg bg-white relative'>
              <ScrollArea className='absolute inset-0' scrollbarSize={6}>
                <Editor />
              </ScrollArea>
            </div>

            <div className='relative flex-1 rounded-lg bg-white p-3 px-2'>
              <ScrollArea scrollbarSize={8} className='absolute inset-0'>
                <div className='h-[1000px]'></div>
                <SendMessage
                  classNames={{ rootWrapper: 'sticky bottom-0' }}
                  targetId={card._id}
                  createMessage={async ({ files, value }) => {}}
                />
              </ScrollArea>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
