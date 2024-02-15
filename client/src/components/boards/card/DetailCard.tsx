import { Divider, Modal, ScrollArea } from '@mantine/core'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/useAppMutation'
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
  const dispatch = useDispatch()
  const socketEmit = useAppEmitSocket()

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
            <div className='relative w-80'>
              <Properties />
            </div>

            <div className='flex flex-1 flex-col rounded-lg bg-white'>
              <div className='relative flex-1 text-sm'>
                <ScrollArea className='absolute inset-0' scrollbarSize={6}>
                  <Editor />
                  <Divider className='mx-4 my-4' />

                  <div className='px-2'>
                    <SendMessage
                      targetId={card._id}
                      createMessage={async ({ files, value }) => {
                        if (!card._id) return
                        await createChannelMessage(
                          {
                            url: {
                              baseUrl:
                                '/workspace/boards/:boardId/cards/:cardId/messages',
                              urlParams: {
                                boardId: card.boardId,
                                cardId: card._id
                              }
                            },
                            method: 'post',
                            payload: {
                              attachments: files,
                              content: value
                            }
                          },
                          {
                            onSuccess(message) {
                              dispatch(
                                workspaceActions.addMessages({
                                  [message._id]: message
                                })
                              )
                              socketEmit({
                                key: 'stopTyping',
                                targetId: card._id
                              })
                            }
                          }
                        )
                      }}
                    />
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
