import { Image, ScrollArea, Select, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import '@mantine/dates/styles.css'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Fragment, useEffect, useState } from 'react'
import useAppParams from '../../../../hooks/useAppParams'
import { useAppSelector } from '../../../../redux/store'
import Watching from '../../../../redux/Watching'
import { useAppMutation } from '../../../../services/apis/mutations/useAppMutation'
import { EPropertyType } from '../../../../types'

dayjs.extend(customParseFormat)

export default function Properties() {
  const { boardId, cardId } = useAppParams()
  const card = useAppSelector(state =>
    Object.values(state.workspace.cards).find(e => e.id === cardId)
  )
  const properties = useAppSelector(state =>
    Object.values(state.workspace.properties).filter(
      e => e.workspaceId === boardId
    )
  )
  const { mutateAsync: updateCard } = useAppMutation('updateCard')
  const [tmpValue, setTmpValue] = useState<any>({})

  useEffect(() => {
    if (card?.properties) {
      setTmpValue(card.properties)
    }
  }, [card?.properties])

  return (
    <div className='relative flex w-80 flex-col rounded-lg bg-white p-3'>
      <Image
        loading='lazy'
        className='rounded-lg'
        src={
          'https://s3.ap-southeast-1.amazonaws.com/liveworkspace.senytera/1709031245746_ca114960-a6a3-4acd-8b63-02f5a9155ed0_wallpapersden.com_stitched_woman_face_wxl.jpg'
        }
      />
      <div className='relative mt-2 flex-1'>
        <ScrollArea
          className='absolute inset-0 right-[-8px] pr-2'
          scrollbarSize={8}
        >
          {properties?.map(property => (
            <Fragment key={property.id}>
              {property.type === EPropertyType.Select && (
                <Watching
                  watchingFn={
                    state =>
                      Object.values(state.workspace.options).filter(
                        option => option.propertyId === property.id
                      )
                    // .sort((a, b) => a.order - b.order)
                  }
                >
                  {options => (
                    <Select
                      className='!mt-2 first:!mt-0'
                      label={property.title}
                      description={property.title}
                      placeholder='Pick value'
                      data={options?.map(option => ({
                        value: option.id,
                        label: option.title
                      }))}
                      mt='md'
                      value={tmpValue[property.id]?.toString()}
                      onChange={value => {
                        // setTmpValue(old => ({ ...old, [property.id]: value }))
                        // updateCard({
                        //   url: {
                        //     baseUrl: '/workspace/boards/:boardId/cards/:cardId',
                        //     urlParams: {
                        //       boardId: boardId!,
                        //       cardId: card?.id!
                        //     }
                        //   },
                        //   method: 'patch',
                        //   payload: {
                        //     properties: {
                        //       ...card?.properties,
                        //       [property.id]: value
                        //     }
                        //   }
                        // })
                      }}
                    />
                  )}
                </Watching>
              )}

              {[EPropertyType.People, EPropertyType.Assignees].includes(
                property.type
              ) && (
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
                      className='!mt-2 first:!mt-0'
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
                      value={tmpValue[property.id]?.toString()}
                      onChange={value => {
                        // setTmpValue(old => ({ ...old, [property.id]: value }))
                        // updateCard({
                        //   url: {
                        //     baseUrl: '/workspace/boards/:boardId/cards/:cardId',
                        //     urlParams: {
                        //       boardId: boardId!,
                        //       cardId: card?.id!
                        //     }
                        //   },
                        //   method: 'patch',
                        //   payload: {
                        //     properties: {
                        //       ...card?.properties,
                        //       [property.id]: value
                        //     }
                        //   }
                        // })
                      }}
                    />
                  )}
                />
              )}

              {[
                EPropertyType.String,
                EPropertyType.Number,
                EPropertyType.Link,
                EPropertyType.Email
              ].includes(property.type) && (
                <TextInput
                  className='!mt-2 first:!mt-0'
                  label={property.title}
                  description={property.title}
                  placeholder='Pick value'
                  mt='md'
                  value={tmpValue[property.id]?.toString()}
                  onBlur={value => {
                    // updateCard({
                    //   url: {
                    //     baseUrl: '/workspace/boards/:boardId/cards/:cardId',
                    //     urlParams: {
                    //       boardId: boardId!,
                    //       cardId: card?.id!
                    //     }
                    //   },
                    //   method: 'patch',
                    //   payload: {
                    //     properties: {
                    //       ...card?.properties,
                    //       [property.id]: value.target.value
                    //     }
                    //   }
                    // })
                  }}
                  onChange={value => {
                    // setTmpValue(old => ({
                    //   ...old,
                    //   [property.id]: value.target.value
                    // }))
                  }}
                />
              )}

              {[EPropertyType.Date].includes(property.type) && (
                <DateTimePicker
                  className='!mt-2 first:!mt-0'
                  label={property.title}
                  description={property.title}
                  {...{ placeholder: 'Pick value' }}
                  mt='md'
                  value={
                    card?.properties?.[property.id]?.toString()
                      ? new Date(card?.properties[property.id]?.toString()!)
                      : undefined
                  }
                  onChange={value => {
                    // setTmpValue(old => ({
                    //   ...old,
                    //   [property.id]: value?.toString()
                    // }))
                    // updateCard({
                    //   url: {
                    //     baseUrl: '/workspace/boards/:boardId/cards/:cardId',
                    //     urlParams: {
                    //       boardId: boardId!,
                    //       cardId: card?.id!
                    //     }
                    //   },
                    //   method: 'patch',
                    //   payload: {
                    //     properties: {
                    //       ...card?.properties,
                    //       [property.id]: value?.toString()
                    //     }
                    //   }
                    // })
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
