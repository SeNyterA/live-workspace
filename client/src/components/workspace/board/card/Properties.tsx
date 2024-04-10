import {
  Avatar,
  Input,
  MultiSelect,
  ScrollArea,
  Select,
  TextInput
} from '@mantine/core'
import { DatePickerInput, DateTimePicker } from '@mantine/dates'
import '@mantine/dates/styles.css'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../../hooks/useAppParams'
import { workspaceActions } from '../../../../redux/slices/workspace.slice'
import { getAppValue, useAppSelector } from '../../../../redux/store'
import Watching from '../../../../redux/Watching'
import { useAppMutation } from '../../../../services/apis/mutations/useAppMutation'
import { EPropertyType, extractApi } from '../../../../types'

dayjs.extend(customParseFormat)

export default function Properties() {
  const { boardId, cardId } = useAppParams()
  const dispatch = useDispatch()
  const card = useAppSelector(state =>
    Object.values(state.workspace.cards).find(e => e.id === cardId)
  )
  const properties = useAppSelector(state =>
    Object.values(state.workspace.properties).filter(
      e => e.workspaceId === boardId
    )
  )
  const { mutateAsync: updateCard } = useAppMutation('updateCard', {
    mutationOptions: {
      onSuccess(data, variables, context) {
        console.log(data)
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({
              cards: [data]
            })
          )
        )
      }
    }
  })
  const { mutateAsync: uploadFile, isPending: uploadPending } = useAppMutation(
    'uploadFile',
    {
      config: {
        headers: {
          'Content-Type': undefined
        }
      },
      mutationOptions: {
        onSuccess(data, variables, context) {
          updateCard({
            method: 'patch',
            url: {
              baseUrl: 'boards/:boardId/cards/:cardId',
              urlParams: {
                cardId: cardId!,
                boardId: boardId!
              }
            },
            payload: { card: { thumbnailId: data.id } as any }
          })
        }
      }
    }
  )

  // useEffect(() => {
  //   if (card?.properties) {
  //     setTmpValue(card.properties)
  //   }
  // }, [card?.properties])

  return (
    <div className='card-propetes-wrapper relative flex w-80 flex-col rounded-lg p-3'>
      <Dropzone
        onDrop={files =>
          uploadFile(
            {
              method: 'post',
              isFormData: true,
              url: {
                baseUrl: '/upload'
              },
              payload: { file: files[0] }
            },
            {
              onSuccess(data, variables, context) {
                // setValue('thumbnail', data)
              }
            }
          )
        }
        multiple={false}
        onReject={files => console.log('rejected files', files)}
        maxSize={3 * 1024 * 1024}
        accept={IMAGE_MIME_TYPE}
        className='w-full'
        disabled={uploadPending}
      >
        <Watching
          watchingFn={state => {
            const thumbnail =
              state.workspace.files[state.workspace.cards[cardId!].thumbnailId!]
            return thumbnail
          }}
        >
          {thumbnail => {
            return (
              <Avatar
                classNames={{ placeholder: 'rounded-lg' }}
                src={thumbnail?.path}
                className='h-40 w-full flex-1 rounded-lg border'
                alt='Team thumbnail'
              >
                Team thumbnail
              </Avatar>
            )
          }}
        </Watching>
      </Dropzone>
      <Input.Description className='mt-1'>
        This image is used for thumbnail
      </Input.Description>
      <div className='relative mt-2 flex-1'>
        <ScrollArea
          className='absolute inset-0 left-[-12px] right-[-12px] overflow-visible'
          scrollbarSize={8}
          classNames={{
            viewport: 'px-3'
          }}
        >
          {properties?.map(property => (
            <Fragment key={property.id}>
              {property.type === EPropertyType.Select && (
                <Watching
                  watchingFn={state =>
                    Object.values(state.workspace.options)
                      .filter(option => option.propertyId === property.id)
                      .sort((a, b) => a.order - b.order)
                  }
                >
                  {options => (
                    <Select
                      checkIconPosition='right'
                      clearable
                      className='!mt-2 first:!mt-0'
                      classNames={{
                        input: 'min-h-[30px]',
                        dropdown: 'pr-0'
                      }}
                      label={property.title}
                      description={property.title}
                      placeholder='Pick value'
                      data={options?.map(option => ({
                        value: option.id,
                        label: option.title
                      }))}
                      mt='md'
                      value={card?.properties?.[property.id]?.toString()}
                      onChange={value => {
                        const oldCard = getAppValue(
                          state => state.workspace.cards[cardId!]
                        )
                        if (!oldCard) return
                        dispatch(
                          workspaceActions.updateWorkspaceStore({
                            cards: {
                              [cardId!]: {
                                ...oldCard,
                                properties: {
                                  ...oldCard.properties,
                                  [property.id]: value
                                }
                              }
                            }
                          })
                        )
                        updateCard(
                          {
                            url: {
                              baseUrl: 'boards/:boardId/cards/:cardId',
                              urlParams: {
                                boardId: boardId!,
                                cardId: card?.id!
                              }
                            },
                            method: 'patch',
                            payload: {
                              card: {
                                properties: {
                                  ...oldCard?.properties,
                                  [property.id]: value
                                },
                                order: new Date().getTime()
                              } as any
                            }
                          },
                          {
                            onError(error, variables, context) {
                              dispatch(
                                workspaceActions.updateWorkspaceStore({
                                  cards: { [cardId!]: oldCard }
                                })
                              )
                            }
                          }
                        )
                      }}
                    />
                  )}
                </Watching>
              )}

              {property.type === EPropertyType.MultiSelect && (
                <Watching
                  watchingFn={state =>
                    Object.values(state.workspace.options)
                      .filter(option => option.propertyId === property.id)
                      .sort((a, b) => a.order - b.order)
                  }
                >
                  {options => (
                    <MultiSelect
                      checkIconPosition='right'
                      clearable
                      className='!mt-2 first:!mt-0'
                      classNames={{
                        dropdown: 'pr-0'
                      }}
                      label={property.title}
                      description={property.title}
                      placeholder='Pick value'
                      data={options?.map(option => ({
                        value: option.id,
                        label: option.title
                      }))}
                      mt='md'
                      value={
                        Array.isArray(card?.properties?.[property.id]) &&
                        (card.properties[property.id] as any).every(
                          (item: any) => typeof item === 'string'
                        )
                          ? card.properties[property.id]
                          : []
                      }
                      onChange={value => {
                        const oldCard = getAppValue(
                          state => state.workspace.cards[cardId!]
                        )
                        if (!oldCard) return
                        dispatch(
                          workspaceActions.updateWorkspaceStore({
                            cards: {
                              [cardId!]: {
                                ...oldCard,
                                properties: {
                                  ...oldCard.properties,
                                  [property.id]: value
                                }
                              }
                            }
                          })
                        )
                        updateCard(
                          {
                            url: {
                              baseUrl: 'boards/:boardId/cards/:cardId',
                              urlParams: {
                                boardId: boardId!,
                                cardId: card?.id!
                              }
                            },
                            method: 'patch',
                            payload: {
                              card: {
                                properties: {
                                  ...oldCard?.properties,
                                  [property.id]: value
                                },
                                order: new Date().getTime()
                              } as any
                            }
                          },
                          {
                            onError(error, variables, context) {
                              dispatch(
                                workspaceActions.updateWorkspaceStore({
                                  cards: { [cardId!]: oldCard }
                                })
                              )
                            }
                          }
                        )
                      }}
                    />
                  )}
                </Watching>
              )}

              {EPropertyType.Person === property.type && (
                <Watching
                  watchingFn={state =>
                    Object.values(state.workspace.members)
                      .filter(e => e.workspaceId === boardId)
                      .map(member => ({
                        member,
                        user: state.workspace.users[member.userId]
                      }))
                  }
                  children={data => (
                    <Select
                      checkIconPosition='right'
                      clearable
                      className='!mt-2 first:!mt-0'
                      classNames={{
                        input: 'min-h-[30px]',
                        dropdown: 'pr-0'
                      }}
                      label={property.title}
                      description={property.title}
                      placeholder='Pick value'
                      data={data
                        ?.filter(e => !!e.user)
                        .map(e => ({
                          label: e.user.userName,
                          value: e.user.id
                        }))}
                      mt='md'
                      value={card?.properties?.[property.id]?.toString()}
                      onChange={value => {
                        const oldCard = getAppValue(
                          state => state.workspace.cards[cardId!]
                        )
                        if (!oldCard) return
                        dispatch(
                          workspaceActions.updateWorkspaceStore({
                            cards: {
                              [cardId!]: {
                                ...oldCard,
                                properties: {
                                  ...oldCard.properties,
                                  [property.id]: value
                                }
                              }
                            }
                          })
                        )
                        updateCard(
                          {
                            url: {
                              baseUrl: 'boards/:boardId/cards/:cardId',
                              urlParams: {
                                boardId: boardId!,
                                cardId: card?.id!
                              }
                            },
                            method: 'patch',
                            payload: {
                              card: {
                                properties: {
                                  ...oldCard?.properties,
                                  [property.id]: value
                                },
                                order: new Date().getTime()
                              } as any
                            }
                          },
                          {
                            onError(error, variables, context) {
                              dispatch(
                                workspaceActions.updateWorkspaceStore({
                                  cards: { [cardId!]: oldCard }
                                })
                              )
                            }
                          }
                        )
                      }}
                    />
                  )}
                />
              )}

              {EPropertyType.MultiPerson === property.type && (
                <Watching
                  watchingFn={state =>
                    Object.values(state.workspace.members)
                      .filter(e => e.workspaceId === boardId)
                      .map(member => ({
                        member,
                        user: state.workspace.users[member.userId]
                      }))
                  }
                  children={data => (
                    <MultiSelect
                      checkIconPosition='right'
                      clearable
                      className='!mt-2 first:!mt-0'
                      classNames={{
                        input: 'min-h-[30px]',
                        dropdown: 'pr-0'
                      }}
                      label={property.title}
                      description={property.title}
                      placeholder='Pick value'
                      data={data
                        ?.filter(e => !!e.user)
                        .map(e => ({
                          label: e.user.userName,
                          value: e.user.id
                        }))}
                      mt='md'
                      value={card?.properties?.[property.id]}
                      onChange={value => {
                        const oldCard = getAppValue(
                          state => state.workspace.cards[cardId!]
                        )
                        if (!oldCard) return
                        dispatch(
                          workspaceActions.updateWorkspaceStore({
                            cards: {
                              [cardId!]: {
                                ...oldCard,
                                properties: {
                                  ...oldCard.properties,
                                  [property.id]: value
                                }
                              }
                            }
                          })
                        )
                        updateCard(
                          {
                            url: {
                              baseUrl: 'boards/:boardId/cards/:cardId',
                              urlParams: {
                                boardId: boardId!,
                                cardId: card?.id!
                              }
                            },
                            method: 'patch',
                            payload: {
                              card: {
                                properties: {
                                  ...oldCard?.properties,
                                  [property.id]: value
                                },
                                order: new Date().getTime()
                              } as any
                            }
                          },
                          {
                            onError(error, variables, context) {
                              dispatch(
                                workspaceActions.updateWorkspaceStore({
                                  cards: { [cardId!]: oldCard }
                                })
                              )
                            }
                          }
                        )
                      }}
                    />
                  )}
                />
              )}

              {EPropertyType.Text === property.type && (
                <TextInput
                  key={card?.properties?.[property.id]?.toString()}
                  className='!mt-2 first:!mt-0'
                  label={property.title}
                  description={property.title}
                  placeholder='Pick value'
                  mt='md'
                  defaultValue={card?.properties?.[property.id]?.toString()}
                  classNames={{
                    input: 'min-h-[30px]'
                  }}
                  onBlur={e => {
                    const oldCard = getAppValue(
                      state => state.workspace.cards[cardId!]
                    )
                    if (
                      !oldCard ||
                      e.target.value ===
                        card?.properties?.[property.id]?.toString()
                    )
                      return
                    dispatch(
                      workspaceActions.updateWorkspaceStore({
                        cards: {
                          [cardId!]: {
                            ...oldCard,
                            properties: {
                              ...oldCard.properties,
                              [property.id]: e.target.value
                            }
                          }
                        }
                      })
                    )
                    updateCard(
                      {
                        url: {
                          baseUrl: 'boards/:boardId/cards/:cardId',
                          urlParams: {
                            boardId: boardId!,
                            cardId: card?.id!
                          }
                        },
                        method: 'patch',
                        payload: {
                          card: {
                            properties: {
                              ...oldCard?.properties,
                              [property.id]: e.target.value
                            },
                            order: new Date().getTime()
                          } as any
                        }
                      },
                      {
                        onError(error, variables, context) {
                          dispatch(
                            workspaceActions.updateWorkspaceStore({
                              cards: { [cardId!]: oldCard }
                            })
                          )
                        }
                      }
                    )
                  }}
                />
              )}

              {EPropertyType.Date === property.type && (
                <DateTimePicker
                  className='!mt-2 first:!mt-0'
                  classNames={{
                    input: 'min-h-[30px]'
                  }}
                  clearable
                  label={property.title}
                  description={property.title}
                  placeholder='Pick value'
                  mt='md'
                  onChange={value => {
                    updateCard(
                      {
                        url: {
                          baseUrl: 'boards/:boardId/cards/:cardId',
                          urlParams: {
                            boardId: boardId!,
                            cardId: card?.id!
                          }
                        },
                        method: 'patch',
                        payload: {
                          card: {
                            properties: {
                              ...card?.properties,
                              [property.id]: value
                            },
                            order: new Date().getTime()
                          } as any
                        }
                      },
                      {
                        onError(error, variables, context) {
                          dispatch(
                            workspaceActions.updateWorkspaceStore({
                              cards: { [cardId!]: card! }
                            })
                          )
                        }
                      }
                    )
                  }}
                  value={dayjs(card?.properties?.[property.id]).toDate()}
                />
              )}

              {EPropertyType.RangeDate === property.type && (
                <DatePickerInput
                  clearable
                  onChange={value => {
                    if (
                      Object.values(value)
                        .map(e => e?.toString())
                        .filter(e => !!e).length === 1
                    )
                      return
                    updateCard(
                      {
                        url: {
                          baseUrl: 'boards/:boardId/cards/:cardId',
                          urlParams: {
                            boardId: boardId!,
                            cardId: card?.id!
                          }
                        },
                        method: 'patch',
                        payload: {
                          card: {
                            properties: {
                              ...card?.properties,
                              [property.id]: value
                            },
                            order: new Date().getTime()
                          } as any
                        }
                      },
                      {
                        onError(error, variables, context) {
                          dispatch(
                            workspaceActions.updateWorkspaceStore({
                              cards: { [cardId!]: card! }
                            })
                          )
                        }
                      }
                    )
                  }}
                  type='range'
                  label='Pick dates range'
                  placeholder='Pick dates range'
                  className='!mt-2 first:!mt-0'
                  classNames={{
                    input: 'min-h-[30px]'
                  }}
                />
              )}
            </Fragment>
          ))}
        </ScrollArea>
      </div>
    </div>
  )
}
