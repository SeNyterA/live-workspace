import {
  ActionIcon,
  Button,
  ColorInput,
  Divider,
  Modal,
  MultiSelect,
  NavLink,
  ScrollArea,
  Select,
  TextInput
} from '@mantine/core'
import { DatePickerInput, DateTimePicker } from '@mantine/dates'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import useAppParams from '../../../../hooks/useAppParams'
import { workspaceActions } from '../../../../redux/slices/workspace.slice'
import { useAppSelector } from '../../../../redux/store'
import Watching from '../../../../redux/Watching'
import { useAppMutation } from '../../../../services/apis/mutations/useAppMutation'
import {
  EPropertyType,
  extractApi,
  TProperty,
  TPropertyOption
} from '../../../../types'

export const usePropertyContext = () =>
  useFormContext<Partial<TProperty> & { options: Partial<TPropertyOption>[] }>()

export default function SettingProperty({
  opend,
  onClose
}: {
  opend: boolean
  onClose: () => void
}) {
  const dispatch = useDispatch()
  const { boardId } = useAppParams()
  const [propertyId, setPropertyId] = useState('')
  const property = useAppSelector(state => ({
    ...state.workspace.properties[propertyId!],
    options: Object.values(state.workspace.options).filter(
      option => option.propertyId === propertyId && option.isAvailable
    )
  }))

  const properties = useAppSelector(state =>
    Object.values(state.workspace.properties)
      .filter(e => e.workspaceId === boardId && e.isAvailable)
      .map(e => ({ id: e.id, title: e.title }))
  )

  useEffect(() => {
    if (!properties?.length) return
    if (!propertyId) setPropertyId(properties[0]?.id)
  }, [properties])

  const { mutateAsync: createProperty } = useAppMutation('createProperty', {
    mutationOptions: {
      onSuccess(data, variables, context) {
        setPropertyId(data.id)
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({
              properties: [data]
            })
          )
        )
      }
    }
  })

  const { mutateAsync: updateProperty } = useAppMutation('updateProperty', {
    mutationOptions: {
      onSuccess(data, variables, context) {
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({
              properties: [data]
            })
          )
        )
      }
    }
  })

  const { mutateAsync: createOption } = useAppMutation('createOption', {
    mutationOptions: {
      onSuccess(data, variables, context) {
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({
              options: [data]
            })
          )
        )
      }
    }
  })

  const { mutateAsync: updateOption } = useAppMutation('updateOption', {
    mutationOptions: {
      onSuccess(data, variables, context) {
        dispatch(
          workspaceActions.updateWorkspaceStore(
            extractApi({
              options: [data]
            })
          )
        )
      }
    }
  })

  return (
    <Modal
      onClose={onClose}
      opened={opend}
      title={<p>Property setting</p>}
      size='1000'
      overlayProps={{
        blur: '0.5'
      }}
      centered
      classNames={{
        title: 'flex-1',
        header: 'bg-transparent',
        content: 'rounded-lg flex flex-col bg-black/80 aspect-video',
        inner: 'p-12',
        body: 'flex flex-col flex-1 relative text-sm',
        root: 'text-gray-100'
      }}
    >
      <div className='flex h-full gap-4'>
        <div className='relative w-48 rounded bg-gray-400/20 p-2'>
          <ScrollArea className='absolute inset-0 p-2' scrollbarSize={0}>
            {properties?.map(e => (
              <NavLink
                className='group w-full bg-transparent first:mt-0 hover:bg-gray-400/30'
                classNames={{
                  section:
                    'invisible group-hover:visible hover:text-gray-100 transition-colors'
                }}
                active={e.id === propertyId}
                key={e.id}
                label={e.title}
                onClick={() => setPropertyId(e.id)}
                rightSection={
                  <IconX
                    size={16}
                    onClick={() => {
                      updateProperty({
                        method: 'patch',
                        url: {
                          baseUrl: '/boards/:boardId/properties/:propertyId',
                          urlParams: {
                            boardId: boardId!,
                            propertyId: e.id
                          }
                        },
                        payload: { isAvailable: false }
                      })
                    }}
                  />
                }
              />
            ))}

            <NavLink
              className='w-full bg-transparent first:mt-0 hover:bg-gray-400/30'
              label='Create new'
              rightSection={<IconPlus size={14} />}
              onClick={() => {
                createProperty({
                  method: 'post',
                  url: {
                    baseUrl: '/boards/:boardId/properties',
                    urlParams: {
                      boardId: boardId!
                    }
                  },
                  payload: {
                    title: 'New property',
                    description: 'Description',
                    type: EPropertyType.Select
                  }
                })
              }}
            />
          </ScrollArea>
        </div>

        <div className='relative w-full flex-1'>
          <ScrollArea
            className='absolute inset-0 overflow-hidden'
            scrollbarSize={0}
            onCompositionStart={e => console.log(e)}
            onCompositionEnd={e => console.log(e)}
          >
            <p className='sticky top-0 text-base'>
              {propertyId ? 'Edit property' : 'Create property'}
            </p>

            <TextInput
              key={property?.title}
              defaultValue={property?.title}
              onBlur={e =>
                updateProperty({
                  method: 'patch',
                  url: {
                    baseUrl: '/boards/:boardId/properties/:propertyId',
                    urlParams: {
                      boardId: boardId!,
                      propertyId
                    }
                  },
                  payload: {
                    title: e.target.value
                  }
                })
              }
              label='Title'
              className='mt-2'
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px]'
              }}
            />

            <TextInput
              key={property?.description}
              defaultValue={property?.description}
              onBlur={e =>
                updateProperty({
                  method: 'patch',
                  url: {
                    baseUrl: '/boards/:boardId/properties/:propertyId',
                    urlParams: {
                      boardId: boardId!,
                      propertyId
                    }
                  },
                  payload: {
                    description: e.target.value
                  }
                })
              }
              label='Description'
              className='mt-2'
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px]'
              }}
            />

            <Select
              searchable
              key={property?.type}
              defaultValue={property?.type}
              onChange={e =>
                updateProperty({
                  method: 'patch',
                  url: {
                    baseUrl: '/boards/:boardId/properties/:propertyId',
                    urlParams: {
                      boardId: boardId!,
                      propertyId
                    }
                  },
                  payload: {
                    type: e as EPropertyType
                  }
                })
              }
              className='mt-2'
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-400/20 text-gray-100',
                dropdown:
                  '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
                option: 'hover:bg-gray-700/90'
              }}
              label='Property type'
              description='Select the type of property'
              data={Object.values(EPropertyType)}
            />

            {[EPropertyType.Select, EPropertyType.MultiSelect].includes(
              property?.type!
            ) && (
              <>
                {property?.options?.map((option, index) => (
                  <div className='mt-2 flex items-end gap-2'>
                    <ColorInput
                      key={option.color}
                      label='Option color'
                      classNames={{
                        input:
                          'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px] w-32'
                      }}
                      defaultValue={option.color}
                      format='hex'
                      onChange={color =>
                        updateOption({
                          url: {
                            baseUrl:
                              'boards/:boardId/properties/:propertyId/options/:optionId',
                            urlParams: {
                              boardId: boardId!,
                              propertyId,
                              optionId: option.id!
                            }
                          },
                          method: 'patch',
                          payload: {
                            color
                          }
                        })
                      }
                      swatches={[
                        '#2e2e2e',
                        '#868e96',
                        '#fa5252',
                        '#e64980',
                        '#be4bdb',
                        '#7950f2',
                        '#4c6ef5',
                        '#228be6',
                        '#15aabf',
                        '#12b886',
                        '#40c057',
                        '#82c91e',
                        '#fab005',
                        '#fd7e14'
                      ]}
                    />
                    <TextInput
                      key={option.title}
                      defaultValue={option.title}
                      onBlur={e =>
                        updateOption({
                          url: {
                            baseUrl:
                              'boards/:boardId/properties/:propertyId/options/:optionId',
                            urlParams: {
                              boardId: boardId!,
                              propertyId,
                              optionId: option.id!
                            }
                          },
                          method: 'patch',
                          payload: {
                            title: e.target.value
                          }
                        })
                      }
                      label='Option value'
                      classNames={{
                        root: 'flex-1',
                        input:
                          'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px]'
                      }}
                    />
                    <ActionIcon
                      size={36}
                      className='bg-gray-400/20'
                      onClick={() => {
                        updateOption({
                          url: {
                            baseUrl:
                              'boards/:boardId/properties/:propertyId/options/:optionId',
                            urlParams: {
                              boardId: boardId!,
                              propertyId,
                              optionId: option.id!
                            }
                          },
                          method: 'patch',
                          payload: { isAvailable: false }
                        })
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </div>
                ))}
                <div className='flex w-full justify-end'>
                  <Button
                    className='mt-2 bg-gray-400/20'
                    onClick={() =>
                      createOption({
                        method: 'post',
                        url: {
                          baseUrl:
                            'boards/:boardId/properties/:propertyId/options',
                          urlParams: {
                            boardId: boardId!,
                            propertyId
                          }
                        },
                        payload: {
                          title: 'New option',
                          color: '#2e2e2e'
                        }
                      })
                    }
                  >
                    Add option
                  </Button>
                </div>
              </>
            )}
          </ScrollArea>
        </div>

        <Divider
          orientation='vertical'
          className='h-full border-gray-400/20'
          variant='dashed'
        />

        <div className='h-full flex-1 justify-between gap-2'>
          <p className='text-base'>
            {propertyId ? 'Edit property' : 'Create property'}
          </p>
          {property?.type === EPropertyType.Select && (
            <Select
              searchable
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-400/20 text-gray-100',
                dropdown:
                  '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
                option: 'hover:bg-gray-700/90'
              }}
              label={property.title}
              description={property.description}
              data={property?.options?.map(option => ({
                value: option.id,
                label: option.title!
              }))}
            />
          )}

          {property?.type === EPropertyType.MultiSelect && (
            <MultiSelect
              searchable
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-400/20 text-gray-100',
                dropdown:
                  '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
                option: 'hover:bg-gray-700/90'
              }}
              label={property.title}
              description={property.description}
              data={property?.options?.map(option => ({
                value: option.id,
                label: option.title!
              }))}
            />
          )}

          {property?.type === EPropertyType.Text && (
            <TextInput
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-400/20 text-gray-100'
              }}
              label={property.title}
              description={property.description}
            />
          )}

          {property?.type === EPropertyType.RangeDate && (
            <DatePickerInput
              type='range'
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-400/20 text-gray-100'
              }}
              label={property.title}
              description={property.description}
            />
          )}

          {property?.type === EPropertyType.Date && (
            <DateTimePicker
              classNames={{
                input:
                  'border-gray-100 border-none bg-gray-400/20 text-gray-100'
              }}
              label={property.title}
              description={property.description}
            />
          )}

          {property?.type === EPropertyType.Person && (
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
                  classNames={{
                    input:
                      'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px]',
                    dropdown:
                      '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
                    option: 'hover:bg-gray-700/90'
                  }}
                  label={property.title}
                  description={property.description}
                  placeholder='Pick value'
                  data={data
                    ?.filter(e => !!e.user)
                    .map(e => ({
                      label: e.user.userName,
                      value: e.user.id
                    }))}
                  mt='md'
                />
              )}
            />
          )}

          {property?.type === EPropertyType.MultiPerson && (
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
                  classNames={{
                    input:
                      'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px]',
                    dropdown:
                      '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
                    option: 'hover:bg-gray-700/90'
                  }}
                  label={property.title}
                  description={property.description}
                  placeholder='Pick value'
                  data={data
                    ?.filter(e => !!e.user)
                    .map(e => ({
                      label: e.user.userName,
                      value: e.user.id
                    }))}
                  mt='md'
                />
              )}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
