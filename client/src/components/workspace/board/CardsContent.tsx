import { ScrollArea } from '@mantine/core'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import { useDispatch } from 'react-redux'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useRenderCount from '../../../hooks/useRenderCount'
import { workspaceActions } from '../../../redux/slices/workspace.slice'
import { getAppValue, useAppSelector } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { useBoard } from './BoardProvider'
import CardOptions from './CardOptions'

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

  console.log({ to, length: options.length })
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

const getNewCard = (result: DropResult, propertyId: string) => {
  if (!result.destination) return
  if (
    result.source.droppableId === result.destination.droppableId &&
    result.source.index === result.destination.index
  )
    return
  const card = getAppValue(state => state.workspace.cards[result.draggableId])
  if (!card) return

  const cards =
    getAppValue(state =>
      Object.values(state.workspace.cards)
        .filter(
          card =>
            card.properties?.[propertyId] === result.destination?.droppableId
        )
        .sort((a, b) => a.order - b.order)
    ) || []
  let newOrder: number

  if (result.destination.droppableId !== result.source.droppableId) {
    if (result.destination.index === 0) {
      if (cards.length === 0) {
        newOrder = new Date().getTime()
      } else {
        newOrder = cards[0].order / 2
      }
    } else if (result.destination.index === cards.length) {
      newOrder = new Date().getTime()
    } else {
      newOrder =
        (cards[result.destination.index].order +
          cards[result.destination.index - 1].order) /
        2
    }
  } else {
    if (result.destination.index === 0) {
      newOrder = cards[0].order / 2
    } else if (result.destination.index === cards.length - 1) {
      newOrder = cards[cards.length - 1].order + 0.5
    } else if (result.destination.index < result.source.index) {
      newOrder =
        (cards[result.destination.index].order +
          cards[result.destination.index - 1].order) /
        2
    } else {
      newOrder =
        (cards[result.destination.index].order +
          cards[result.destination.index + 1].order) /
        2
    }
  }

  return { newOrder, oldCard: card }
}

export default function CardsContent() {
  useRenderCount('CardsContent')
  const { toogleCard } = useAppControlParams()
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
            className='absolute inset-0 cursor-pointer'
            classNames={{ viewport: 'p-2' }}
            scrollbarSize={8}
          >
            <DragDropContext
              onDragEnd={result => {
                console.log(result)
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
                          'boards/:boardId/properies/:propertyId/options/:optionId/order',
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
                  getNewCard(result, trackingId!)

                  const data = getNewCard(result, trackingId!)
                  if (!data) return
                  const { newOrder, oldCard } = data
                  dispatch(
                    workspaceActions.updateWorkspaceStore({
                      cards: {
                        [oldCard.id]: {
                          ...oldCard,
                          properties: {
                            ...oldCard.properties,
                            [trackingId!]: result.destination?.droppableId
                          },
                          order: newOrder
                        }
                      }
                    })
                  )
                  updateCard(
                    {
                      url: {
                        baseUrl: 'boards/:boardId/cards/:cardId',
                        urlParams: { boardId: boardId!, cardId: oldCard.id }
                      },
                      method: 'patch',
                      payload: {
                        card: {
                          properties: {
                            ...oldCard.properties,
                            [trackingId!]: result.destination?.droppableId
                          },
                          order: newOrder
                        } as any
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
                            className='group mx-1 w-64'
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                          >
                            <CardOptions
                              propertyId={propertyRoot.id}
                              dragProvided={dragProvided}
                              option={option}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {/* <div className='mx-1 w-64 group'>
                      <CardOptions propertyId={propertyRoot.id} />
                    </div> */}

                    <Draggable draggableId='orhter' index={9999} isDragDisabled>
                      {dragProvided => (
                        <div
                          className='group mx-1 w-64'
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                        >
                          <CardOptions propertyId={propertyRoot.id} />
                        </div>
                      )}
                    </Draggable>

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
