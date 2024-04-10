import { ActionIcon, Button, ColorInput, TextInput } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import { useFieldArray } from 'react-hook-form'
import { usePropertyContext } from '../SettingProperty'

export default function Options() {
  const { control } = usePropertyContext()
  const { append, fields, update, remove } = useFieldArray({
    control: control,
    name: 'options'
  })

  return (
    <>
      {fields.map((option, index) => (
        <div className='mt-2 flex items-end gap-2'>
          <ColorInput
            label='Option color'
            classNames={{
              input:
                'border-gray-100 border-none   min-h-[30px] w-32'
            }}
            format='hex'
            onChange={color => update(index, { title: option.title, color })}
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
                'border-gray-100 border-none   min-h-[30px]'
            }}
          />
          <ActionIcon
            size={36}
            className=''
            onClick={() => remove(index)}4-0
          >
            <IconX size={16} />
          </ActionIcon>
        </div>
      ))}

      <Button
        className='mt-2 '
        onClick={() =>
          append({
            title: 'Title option',
            color: '#2e2e2e'
          })
        }
      >
        Add option
      </Button>
    </>
  )
}
