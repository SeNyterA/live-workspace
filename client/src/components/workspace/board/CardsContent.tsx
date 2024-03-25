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

const getNewOptionOrder = ({
  from,
  to,
  trackingId
}: {
  from: number
  to?: number
  trackingId: string
}) => {
  if (to === from || to === undefined) return

  const options =
    getAppValue(state =>
      Object.values(state.workspace.options)
        .filter(option => option.propertyId === trackingId)
        .sort((a, b) => a.order - b.order)
    ) || []

  if (options.length === 0) return

  if (to === 0)
    return { oldOption: options[from], newOrder: options[0].order / 2 }
  if (to === options.length - 1)
    return { oldOption: options[from], newOrder: options[to].order + 0.5 }
  if (from > to)
    return {
      oldOption: options[from],
      newOrder: (options[to].order + options[to - 1].order) / 2
    }
  if (from < to) {
    return {
      oldOption: options[from],
      newOrder: (options[to].order + options[to + 1].order) / 2
    }
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
  const { mutateAsync: updateColumnPosition } = useAppMutation(
    'updateColumnPosition'
  )
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

                  const data = getNewOptionOrder({
                    from: result.source.index,
                    to: result.destination?.index,
                    trackingId: trackingId!
                  })

                  if (!data) return

                  const { newOrder, oldOption } = data
                  dispatch(
                    workspaceActions.updateWorkspaceStore({
                      options: {
                        [oldOption.id]: { ...oldOption, order: newOrder }
                      }
                    })
                  )

                  updateColumnPosition(
                    {
                      method: 'patch',
                      url: {
                        baseUrl:
                          'boards/:boardId/properies/:propertyId/options/:optionId',
                        urlParams: {
                          boardId: boardId!,
                          propertyId: trackingId!,
                          optionId: oldOption.id
                        }
                      },
                      payload: {
                        order: newOrder
                      }
                    },
                    {
                      onError(error, variables, context) {
                        dispatch(
                          workspaceActions.updateWorkspaceStore({
                            options: {
                              [oldOption.id]: {
                                ...getAppValue(
                                  state =>
                                    state.workspace.options[
                                      variables.url.urlParams.optionId
                                    ]
                                )!,
                                order: oldOption.order
                              }
                            }
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
                              className='sticky top-0'
                            >
                              <div className='flex h-9 items-center justify-between rounded border border-gray-300 bg-black bg-gray-900/90 px-2 pr-1'>
                                <span>{option.title + option.order}</span>
                                <ActionIcon
                                  variant='transparent'
                                  aria-label='Settings'
                                  className='h-[28px] w-[28px] bg-blue-400/20 text-white'
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
