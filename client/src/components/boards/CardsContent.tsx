import { ActionIcon, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../hooks/useAppControlParams'
import useRenderCount from '../../hooks/useRenderCount'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { EFieldType } from '../../services/apis/board/board.api'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { TOption } from '../../types/workspace.type'
import { useBoard } from './BoardProvider'
import CardOptions from './CardOptions'

const updateOptionPosition = (
  options: TOption[],
  optionId: string,
  moveToIndex: number
): TOption[] => {
  const updatedOptions = [...options]
  const currentIndex = options.findIndex(option => option._id === optionId)

  if (currentIndex === -1 || moveToIndex < 0 || moveToIndex >= options.length) {
    return updatedOptions
  }

  const [removedOption] = updatedOptions.splice(currentIndex, 1)
  updatedOptions.splice(moveToIndex, 0, removedOption)

  return updatedOptions
}

export default function CardsContent() {
  useRenderCount('CardsContent')
  const { trackingId, boardId } = useBoard()
  const { toogleCard } = useAppControlParams()
  const { mutateAsync: createCard } = useAppMutation('createCard')
  const { mutateAsync: updateCard } = useAppMutation('updateCard')
  const { mutateAsync: updateProperty } = useAppMutation('updateProperty')
  const dispatch = useDispatch()

  const propertyRoot = useAppSelector(
    state => state.workspace.properties[trackingId!]
  )

  // const memberUsers = useAppSelector(state =>
  //   Object.values(state.workspace.members)
  //     .filter(e => e.targetId === boardId)
  //     .map(member => ({
  //       member,
  //       user: state.workspace.users[member.userId]
  //     }))
  // )

  const getOptions = (): TOption[] | undefined => {
    switch (propertyRoot?.fieldType) {
      case EFieldType.Select:
        return propertyRoot?.fieldOption || []
      // case EFieldType.People:
      //   return memberUsers
      //     ?.filter(e => !!e.user)
      //     .map(e => ({ _id: e.user._id, title: e.user.userName }))
      default:
        return []
    }
  }

  const options = getOptions() || []

  return (
    <>
      {propertyRoot && (
        <div className='relative flex-1'>
          <ScrollArea
            className='absolute inset-0 cursor-pointer'
            scrollbarSize={8}
          >
            <div className='flex gap-3 px-2 py-3'>
              <DragDropContext
                onDragEnd={result => {
                  console.log(result)

                  if (result.type === 'column') {
                    if (result.destination?.index === undefined) return

                    const newFieldOption = updateOptionPosition(
                      propertyRoot.fieldOption || [],
                      result.draggableId,
                      result.destination.index
                    )

                    dispatch(
                      workspaceActions.updatePropertyOptions({
                        propertyId: propertyRoot._id,
                        fieldOption: newFieldOption
                      })
                    )

                    updateProperty({
                      method: 'patch',
                      url: {
                        baseUrl:
                          '/workspace/boards/:boardId/properties/:propertyId',
                        urlParams: {
                          boardId: boardId!,
                          propertyId: propertyRoot._id
                        }
                      },
                      payload: {
                        fieldOption: newFieldOption
                      }
                    }).catch(() => {
                      dispatch(
                        workspaceActions.updatePropertyOptions({
                          propertyId: propertyRoot._id,
                          fieldOption: propertyRoot.fieldOption || []
                        })
                      )
                    })
                  }

                  if (result.type === 'card') {
                    if (!result.destination?.droppableId) return

                    dispatch(
                      workspaceActions.updateCardData({
                        cardId: result.draggableId,
                        data: {
                          [propertyRoot._id]: result.destination.droppableId
                        }
                      })
                    )

                    updateCard({
                      method: 'patch',
                      url: {
                        baseUrl: '/workspace/boards/:boardId/cards/:cardId',
                        urlParams: {
                          boardId: boardId!,
                          cardId: result.draggableId
                        }
                      },
                      payload: {
                        data: {
                          [propertyRoot._id]: result.destination?.droppableId
                        }
                      }
                    }).catch(() => {
                      dispatch(
                        workspaceActions.updateCardData({
                          cardId: result.draggableId,
                          data: {
                            [propertyRoot._id]: result.source.droppableId
                          }
                        })
                      )
                    })
                  }
                }}
              >
                <Droppable
                  droppableId='all-droppables'
                  direction='horizontal'
                  type='column'
                >
                  {dropProvided => (
                    <div
                      className='flex'
                      {...dropProvided.droppableProps}
                      ref={dropProvided.innerRef}
                    >
                      {options.map((option, index) => (
                        <Draggable
                          key={option._id}
                          draggableId={option._id}
                          index={index}
                        >
                          {dragProvided => (
                            <div
                              className='mx-1 w-64'
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                            >
                              <div
                                {...dragProvided.dragHandleProps}
                                className='flex h-9 items-center justify-between rounded bg-gray-100 px-2'
                              >
                                <span>{option.title}</span>
                                <ActionIcon
                                  variant='transparent'
                                  aria-label='Settings'
                                  className='h-[30px] w-[30px] bg-gray-100 text-gray-600'
                                  onClick={() => {
                                    const timeStamp =
                                      new Date().getMilliseconds()
                                    createCard({
                                      url: {
                                        baseUrl:
                                          '/workspace/boards/:boardId/cards',
                                        urlParams: { boardId: boardId! }
                                      },
                                      method: 'post',
                                      payload: {
                                        title: 'anything bro' + timeStamp,
                                        data: {
                                          [propertyRoot._id]: option._id
                                        }
                                      }
                                    }).then(data => {
                                      console.log(data)
                                      if (data.data?._id) {
                                        toogleCard({ cardId: data.data._id })
                                      }
                                    })
                                  }}
                                >
                                  <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                              </div>
                              <CardOptions
                                propertyId={propertyRoot._id}
                                optionId={option._id}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {dropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  )
}
