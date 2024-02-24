import { ActionIcon, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../hooks/useAppControlParams'
import useRenderCount from '../../hooks/useRenderCount'
import { useAppSelector } from '../../redux/store'
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

  const options = useAppSelector(state =>
    Object.values(state.workspace.options)
      .filter(option => option.propertyId === trackingId)
      .sort((a, b) => a.order - b.order)
  )

  return (
    <>
      {propertyRoot && (
        <div className='relative flex-1'>
          <ScrollArea
            className='absolute inset-0 cursor-pointer px-2 pt-2'
            scrollbarSize={8}
          >
            <DragDropContext
              onDragEnd={result => {
                if (result.type === 'column') {
                  if (result.destination?.index === undefined) return

                  const newFieldOption = updateOptionPosition(
                    propertyRoot.fieldOption || [],
                    result.draggableId,
                    result.destination.index
                  )

                  // dispatch(
                  //   workspaceActions.updatePropertyOptions({
                  //     propertyId: propertyRoot._id,
                  //     fieldOption: newFieldOption
                  //   })
                  // )

                  // updateProperty({
                  //   method: 'patch',
                  //   url: {
                  //     baseUrl:
                  //       '/workspace/boards/:boardId/properties/:propertyId',
                  //     urlParams: {
                  //       boardId: boardId!,
                  //       propertyId: propertyRoot._id
                  //     }
                  //   },
                  //   payload: {
                  //     fieldOption: newFieldOption
                  //   }
                  // }).catch(() => {
                  //   dispatch(
                  //     workspaceActions.updatePropertyOptions({
                  //       propertyId: propertyRoot._id,
                  //       fieldOption: propertyRoot.fieldOption || []
                  //     })
                  //   )
                  // })
                }

                // if (result.type === 'card') {
                //   if (!result.destination?.droppableId) return
                //   const oldCard = getAppValue(
                //     state => state.workspace.cards[result.draggableId]
                //   )
                //   if (!oldCard) return

                //   dispatch(
                //     workspaceActions.updateCardProperties({
                //       cardId: result.draggableId,
                //       data: {
                //         ...oldCard.properties,
                //         [propertyRoot._id]: result.destination.droppableId
                //       }
                //     })
                //   )

                //   updateCard({
                //     method: 'patch',
                //     url: {
                //       baseUrl: '/workspace/boards/:boardId/cards/:cardId',
                //       urlParams: {
                //         boardId: boardId!,
                //         cardId: result.draggableId
                //       }
                //     },
                //     payload: {
                //       properties: {
                //         ...oldCard.properties,
                //         [propertyRoot._id]: result.destination?.droppableId
                //       }
                //     }
                //   }).catch(() => {
                //     dispatch(
                //       workspaceActions.updateCardProperties({
                //         cardId: result.draggableId,
                //         data: {
                //           ...oldCard.properties
                //         }
                //       })
                //     )
                //   })
                // }
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
                    {options?.map((option, index) => (
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
                              className='sticky top-0 bg-white pt-1'
                            >
                              <div className='flex h-9 items-center justify-between rounded border border-gray-300 bg-gray-100 px-2 ring-1 ring-blue-300'>
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
                                        properties: {
                                          [propertyRoot._id]: option._id
                                        }
                                      }
                                    }).then(data => {
                                      if (data.data?._id) {
                                        toogleCard({ cardId: data.data._id })
                                      }
                                    })
                                  }}
                                >
                                  <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                              </div>
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
          </ScrollArea>
        </div>
      )}
    </>
  )
}
