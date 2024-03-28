import {
  ActionIcon,
  Button,
  ColorInput,
  Divider,
  Modal,
  Select,
  TextInput
} from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch
} from 'react-hook-form'
import { TProperty, TPropertyOption } from '../../../../types'

export default function SettingProperty() {
  const { control, setValue, watch } = useForm<
    Partial<TProperty> & { options: Partial<TPropertyOption>[] }
  >()

  const options = useWatch({
    control,
    name: 'options',
    defaultValue: []
  })

  //   const { append, fields, update, remove } = useFieldArray({
  //     control,
  //     name: 'options'
  //   })

  console.count('ss')

  return (
    <Modal
      onClose={() => {}}
      opened={true}
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
      <div className='flex h-full gap-4'>
        <div className='w-48 rounded bg-gray-400/20 p-2'>
          <Button className='w-full bg-gray-400'>Select</Button>
        </div>

        <div className='flex-1'>
          <Controller
            control={control}
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
            control={control}
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

          <Divider className='my-2 bg-slate-100/20' variant='dashed' />

          {options.map((option, index) => (
            <div className='mt-2 flex items-end gap-2'>
              <ColorInput
                label='Option color'
                classNames={{
                  input:
                    'border-gray-100 border-none bg-gray-400/20 text-gray-100 min-h-[30px] w-32'
                }}
                format='hex'
                onChange={color =>
                  //   update(index, { title: option.title, color })
                  setValue(
                    'options',
                    options.map((e, i) => (i === index ? { ...e, color } : e))
                  )
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
                onChange={e => {
                  //   update(index, { title: e.target.value, color: option.color })
                }}
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
                onClick={() =>
                  // remove(index)
                  setValue(
                    'options',
                    options.filter((e, i) => i !== index)
                  )
                }
              >
                <IconX size={16} />
              </ActionIcon>
            </div>
          ))}

          <Button
            onClick={() =>
              //   append({
              //     title: 'Title option',
              //     color: '#2e2e2e'
              //   })
              setValue('options', [
                ...options,
                {
                  title: 'Title option',
                  color: '#2e2e2e'
                }
              ])
            }
          >
            Add option
          </Button>
        </div>

        <Divider
          orientation='vertical'
          className='h-full border-gray-400/20'
          variant='dashed'
        />

        <Select
          classNames={{
            input: 'border-gray-100 border-none bg-gray-400/20 text-gray-100',
            dropdown: '!bg-gray-900/90 text-gray-100 border-gray-400/20 pr-0',
            option: 'hover:bg-gray-700/90'
          }}
          className='flex-1'
          label={
            <Controller
              control={control}
              name='title'
              render={({ field }) => <>{field.value}</>}
            />
          }
          description={
            <Controller
              control={control}
              name='description'
              render={({ field }) => <>{field.value}</>}
            />
          }
          data={options.map(option => ({
            value: option.id || `tmp__${Math.random}`,
            label: option.title!
          }))}
        />
      </div>
    </Modal>
  )
}
