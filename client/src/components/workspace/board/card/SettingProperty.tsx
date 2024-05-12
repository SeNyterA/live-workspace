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
import {
  IconBox,
  IconBoxMultiple,
  IconCalendar,
  IconCalendarMonth,
  IconLayoutKanban,
  IconLetterA,
  IconLetterT,
  IconPlus,
  IconTextCaption,
  IconTextPlus,
  IconUser,
  IconUsers,
  IconX
} from '@tabler/icons-react'
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

const Icons = {
  [EPropertyType.Text]: <IconLetterA size={16} />,
  [EPropertyType.Date]: <IconCalendar size={16} />,
  [EPropertyType.RangeDate]: <IconCalendarMonth size={16} />,
  [EPropertyType.Person]: <IconUser size={16} />,
  [EPropertyType.MultiPerson]: <IconUsers size={16} />,
  [EPropertyType.Select]: <IconBox size={16} />,
  [EPropertyType.MultiSelect]: <IconBoxMultiple size={16} />
}

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
      .map(e => ({ id: e.id, title: e.title, type: e.type }))
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
      title={'Property setting'}
      size='1000'
      overlayProps={{
        blur: '0.5'
      }}
      centered
      classNames={{
        title: 'flex-1 text-lg',
        header: 'bg-transparent',
        content: 'rounded-lg flex flex-col aspect-video',
        inner: 'p-12',
        body: 'flex flex-col flex-1 relative text-sm'
      }}
    >
      <div className='flex h-full gap-4'>
        <div className='relative w-48 rounded p-2'>
          <ScrollArea
            className='absolute inset-0 inset-x-[-12px]'
            scrollbarSize={0}
            classNames={{ viewport: 'px-3' }}
          >
            {properties?.map(e => (
              <NavLink
                leftSection={Icons[e.type]}
                className='group group w-full bg-transparent px-1 first:mt-0'
                classNames={{
                  children: 'pl-0 mb-2',
                  section:
                    'data-[position="left"]:me-[8px] data-[position="right"]:hidden group-hover:block'
                }}
                variant='indicator'
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
              className='group group w-full bg-transparent px-1 first:mt-0'
              classNames={{
                children: 'pl-0 mb-2',
                section:
                  'data-[position="left"]:me-[8px] data-[position="right"]:hidden group-hover:block'
              }}
              label='Create new'
              leftSection={<IconPlus size={14} />}
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
            className='absolute inset-0 inset-x-[-12px] overflow-visible'
            scrollbarSize={0}
            onCompositionStart={e => console.log(e)}
            onCompositionEnd={e => console.log(e)}
            classNames={{ viewport: 'px-3' }}
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
                input: 'min-h-[30px]'
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
                input: 'min-h-[30px]'
              }}
            />

            <Select
              checkIconPosition='right'
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
                dropdown: 'pr-0'
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
                        input: 'min-h-[30px] w-32'
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
                        input: 'min-h-[30px]'
                      }}
                    />
                    <ActionIcon
                      size={36}
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
                    className='mt-2 '
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
              checkIconPosition='right'
              searchable
              classNames={{
                dropdown: 'pr-0'
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
              checkIconPosition='right'
              searchable
              classNames={{
                dropdown: 'pr-0'
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
              label={property.title}
              description={property.description}
            />
          )}

          {property?.type === EPropertyType.RangeDate && (
            <DatePickerInput
              type='range'
              label={property.title}
              description={property.description}
            />
          )}

          {property?.type === EPropertyType.Date && (
            <DateTimePicker
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
                  checkIconPosition='right'
                  classNames={{
                    input: 'min-h-[30px]',
                    dropdown: 'pr-0'
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
                  checkIconPosition='right'
                  classNames={{
                    input: 'min-h-[30px]',
                    dropdown: 'pr-0'
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
