import { ActionIcon, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import useRenderCount from '../../../hooks/useRenderCount'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { getAppValue, useAppSelector } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { TPropertyOption } from '../../../types'
import { useBoard } from './BoardProvider'
import CardOptions from './CardOptions'

const getOptionWithNewOrder = ({
  draggableId,
  to,
  from,
  options
}: {
  options?: TPropertyOption[]
  from: number
  to?: number
  draggableId: string
}) => {
  try {
    const optionTaget = options?.find(e => e.id === draggableId)

    if (!optionTaget) return

    if (to === from || to === undefined) return

    const optionBefore = options?.[to - 1]
    const optionAfter = options?.[to]

    if (to === 0 && optionAfter) {
      return {
        newOption: { ...optionTaget, order: optionAfter.order / 2 },
        oldOption: optionTaget
      }
    }

    if (to === (options || []).length - 1 && optionBefore) {
      return {
        newOption: { ...optionTaget, order: optionBefore.order + 0.5 },
        oldOption: optionTaget
      }
    }

    if (optionAfter && optionBefore) {
      return {
        newOption: {
          ...optionTaget,
          order: (optionAfter.order + optionBefore.order) / 2
        },
        oldOption: optionTaget
      }
    }
  } catch (error) {
    return
  }
}

const getCardUpdated = ({
  cardId,
  optionId,
  trackingId
}: {
  trackingId: string
  cardId: string
  optionId: string
}) => {
  const card = getAppValue(state => state.workspace.cards[cardId])
  if (!card) return

  return {
    newCard: {
      ...card,
      properties: {
        ...card.properties,
        [trackingId]: optionId
      }
    },
    oldCard: card
  }
}

export default function CardsContent() {
  useRenderCount('CardsContent')
  const { trackingId, boardId } = useBoard()
  const { mutateAsync: updateOption } = useAppMutation('updateOption')
  const { mutateAsync: updateCard } = useAppMutation('updateCard')
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
                  console.log({ result })
                  const data = getOptionWithNewOrder({
                    draggableId: result.draggableId,
                    from: result.source.index,
                    to: result.destination?.index || 0,
                    options
                  })

                  console.log({data})
                  if (!data) return

                  const { newOption, oldOption } = data
                  dispatch(
                    workspaceActions.updateWorkspaceStore({
                      options: { [newOption.id]: newOption }
                    })
                  )
                  updateOption(
                    {
                      url: {
                        baseUrl: 'boards/:boardId/options/:optionId',
                        urlParams: {
                          boardId: boardId!,
                          optionId: newOption.id
                        }
                      },
                      method: 'patch',
                      payload: {
                        option: {
                          id: newOption.id,
                          order: newOption.order
                        } as any
                      }
                    },
                    {
                      onError: error => {
                        dispatch(
                          workspaceActions.updateWorkspaceStore({
                            options: { [oldOption.id]: oldOption }
                          })
                        )
                      }
                    }
                  )
                }
                if (result.type === 'card') {
                  const data = getCardUpdated({
                    cardId: result.draggableId,
                    optionId: result.destination?.droppableId || '',
                    trackingId: trackingId!
                  })
                  if (!data) return
                  const { newCard, oldCard } = data
                  dispatch(
                    workspaceActions.updateWorkspaceStore({
                      cards: { [newCard.id]: newCard }
                    })
                  )
                  updateCard(
                    {
                      url: {
                        baseUrl: 'boards/:boardId/cards/:cardId',
                        urlParams: { boardId: boardId!, cardId: newCard.id }
                      },
                      method: 'patch',
                      payload: {
                        card: { properties: newCard.properties } as any
                      }
                    },
                    {
                      onSuccess(data, variables, context) {
                        if (data.id) {
                          // toogleCard({ cardId: data.id })
                          dispatch(
                            workspaceActions.updateWorkspaceStore({
                              [data.id]: data
                            })
                          )
                        }
                      },
                      onError: () => {
                        dispatch(
                          workspaceActions.updateWorkspaceStore({
                            cards: { [oldCard.id]: oldCard }
                          })
                        )
                      }
                    }
                  )
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
                    {options?.map((option, index) => (
                      <Draggable
                        key={option.id}
                        draggableId={option.id}
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
                              <div className='flex h-9 items-center justify-between rounded border border-gray-300 bg-gray-100 px-2 ring-1 ring-gray-300'>
                                <span>{option.title}</span>
                                <ActionIcon
                                  variant='transparent'
                                  aria-label='Settings'
                                  className='h-[30px] w-[30px] bg-gray-100 text-gray-600'
                                  onClick={() => {}}
                                >
                                  <IconPlus size={16} stroke={1.5} />
                                </ActionIcon>
                              </div>
                            </div>
                            <CardOptions
                              propertyId={propertyRoot.id}
                              optionId={option.id}
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
