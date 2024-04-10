import { ActionIcon, Button, Checkbox, TextInput } from '@mantine/core'
import { IconHash, IconX } from '@tabler/icons-react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useCreateWorkspaceForm } from './CreateWorkspace'

const TeamChild = ({ name }: { name: 'channels' | 'boards' }) => {
  const { control } = useCreateWorkspaceForm()
  const { append, fields, remove } = useFieldArray({
    control,
    name
  })

  return (
    <Checkbox.Group
      label='Init channels'
      description='Members will be added when created.'
      className='mt-2'
    >
      {fields?.map((_, index) => (
        <Controller
          key={_.id}
          control={control}
          name={`${name}.${index}.title`}
          rules={{
            required: 'Channel name is required'
          }}
          render={({ field: { value, onChange }, fieldState }) => (
            <TextInput
              className='mt-2 flex-1'
              value={value}
              onChange={onChange}
              placeholder='General'
              leftSection={<IconHash size={16} />}
              rightSection={
                <ActionIcon
                  className='hover:bg-gray-400/20'
                  onClick={() => remove(index)}
                >
                  <IconX size={16} />
                </ActionIcon>
              }
              classNames={{
                input:
                  'text-gray-100 bg-gray-400/20 border-gray-100/20 focus:border-gray-100/40 border border-dashed'
              }}
              error={fieldState.error && fieldState.error.message}
            />
          )}
        />
      ))}
      <div className='mt-2 flex justify-end'>
        <Button
          size='sm'
          onClick={() => {
            append({
              title: ''
            } as any)
          }}
        >
          Add Channel
        </Button>
      </div>
    </Checkbox.Group>
  )
}
export default TeamChild
