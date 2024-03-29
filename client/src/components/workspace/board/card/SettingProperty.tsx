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
import { IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch
} from 'react-hook-form'
import useAppParams from '../../../../hooks/useAppParams'
import { getAppValue, useAppSelector } from '../../../../redux/store'
import { EPropertyType, TProperty, TPropertyOption } from '../../../../types'

export const usePropertyContext = () =>
  useFormContext<Partial<TProperty> & { options: Partial<TPropertyOption>[] }>()

export default function SettingProperty() {
  const { boardId } = useAppParams()
  const form = useForm<
    Partial<TProperty> & { options: Partial<TPropertyOption>[] }
  >({
    defaultValues: {
      type: EPropertyType.Select,
      title: 'Title',
      description: 'Description'
    }
  })

  const type = useWatch({
    control: form.control,
    name: 'type'
  })

  console.log({ type })
  const { append, fields, update, remove } = useFieldArray({
    control: form.control,
    name: 'options'
  })

  const _properties = useAppSelector(state =>
    Object.values(state.workspace.properties)
      .filter(e => e.workspaceId === boardId)
      .map(e => ({ id: e.id, title: e.title }))
  )
  const [propertyId, setPropertyId] = useState('')
  useEffect(() => {
    const property = getAppValue(state => {
      return {
        ...state.workspace.properties[propertyId],
        description: '',
        options: Object.values(state.workspace.options).filter(
          e => e.propertyId === propertyId
        )
      }
    })

    if (!property) return

    form.reset(property)
  }, [propertyId])

  return (
    <Modal
      onClose={() => {}}
      opened={!true}
      title={<p>Update property</p>}
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
        root: 'text-gray-100',
        overlay: 'bg-white/10 blur'
      }}
    >
      <FormProvider {...form}>
        <div className='flex h-full gap-4'>
          <div className='w-48 rounded bg-gray-400/20 p-2'>
            {_properties?.map(e => (
              <NavLink
                className='mt-1 w-full bg-transparent first:mt-0 hover:bg-gray-400/30'
                key={e.id}
                label={e.title}
                onClick={() => setPropertyId(e.id)}
              />
            ))}
          </div>

          <div className='relative w-full flex-1'>
            <ScrollArea
              className='absolute inset-0 overflow-hidden'
              scrollbarSize={0}
              onCompositionStart={e => console.log(e)}
              onCompositionEnd={e => console.log(e)}
            >
              <Controller
                control={form.control}
                name='title'
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label='Title'
                    className='mt-2'
                    classNames={{
                      input:
                        'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px]'
                    }}
                  />
                )}
              />

              <Controller
                control={form.control}
                name='description'
                render={({ field }) => (
                  <TextInput
                    {...field}
                    label='Description'
                    className='mt-2'
                    classNames={{
                      input:
                        'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px]'
                    }}
                  />
                )}
              />

              <Controller
                control={form.control}
                name='type'
                render={({ field }) => (
                  <Select
                    {...field}
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
                )}
              />

              {[EPropertyType.Select, EPropertyType.MultiSelect].includes(
                type!
              ) && (
                <>
                  {fields.map((option, index) => (
                    <div className='mt-2 flex items-end gap-2'>
                      <ColorInput
                        label='Option color'
                        classNames={{
                          input:
                            'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px] w-32'
                        }}
                        value={option.color}
                        defaultValue='#fab005'
                        format='hex'
                        onChange={color =>
                          update(index, { title: option.title, color })
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
                        value={option.title}
                        onChange={e =>
                          update(index, {
                            title: e.target.value,
                            color: option.color
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
                        onClick={() => remove(index)}
                      >
                        <IconX size={16} />
                      </ActionIcon>
                    </div>
                  ))}
                  <div className='mt-2 flex w-full justify-end'>
                    <Button
                      className='bg-gray-400/20'
                      onClick={() =>
                        append({
                          title: 'Title option',
                          color: '#2e2e2e'
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

          <div className='flex h-full flex-1 flex-col justify-between'>
            {type === EPropertyType.Select && (
              <Select
                searchable
                classNames={{
                  input:
                    'border-gray-100 border-none bg-gray-400/20 text-gray-100',
                  dropdown:
                    '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
                  option: 'hover:bg-gray-700/90'
                }}
                label={
                  <Controller
                    control={form.control}
                    name='title'
                    render={({ field }) => <>{field.value}</>}
                  />
                }
                description={
                  <Controller
                    control={form.control}
                    name='description'
                    render={({ field }) => <>{field.value}</>}
                  />
                }
                data={fields.map(option => ({
                  value: option.id,
                  label: option.title!
                }))}
              />
            )}

            {type === EPropertyType.MultiSelect && (
              <MultiSelect
                searchable
                classNames={{
                  input:
                    'border-gray-100 border-none bg-gray-400/20 text-gray-100',
                  dropdown:
                    '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
                  option: 'hover:bg-gray-700/90'
                }}
                label={
                  <Controller
                    control={form.control}
                    name='title'
                    render={({ field }) => <>{field.value}</>}
                  />
                }
                description={
                  <Controller
                    control={form.control}
                    name='description'
                    render={({ field }) => <>{field.value}</>}
                  />
                }
                data={fields.map(option => ({
                  value: option.id,
                  label: option.title!
                }))}
              />
            )}

            {type === EPropertyType.Text && (
              <TextInput
                classNames={{
                  input:
                    'border-gray-100 border-none bg-gray-400/20 text-gray-100'
                }}
                label={
                  <Controller
                    control={form.control}
                    name='title'
                    render={({ field }) => <>{field.value}</>}
                  />
                }
                description={
                  <Controller
                    control={form.control}
                    name='description'
                    render={({ field }) => <>{field.value}</>}
                  />
                }
              />
            )}

            <Button
              className='ml-auto w-40 bg-gray-400 bg-gray-400/20'
              onClick={form.handleSubmit(data => {
                console.log({ data })
              })}
            >
              Update
            </Button>
          </div>
        </div>
      </FormProvider>
    </Modal>
  )
}
