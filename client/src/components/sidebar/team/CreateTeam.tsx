import {
  ActionIcon,
  Button,
  Checkbox,
  Drawer,
  ScrollArea,
  Textarea,
  TextInput
} from '@mantine/core'
import { IconHash, IconX } from '@tabler/icons-react'
import { useEffect } from 'react'
import {
  Control,
  Controller,
  DefaultValues,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { useAppMutation } from '../../../services/apis/useAppMutation'
import { TTeamDto } from '../../../types/dto.type'
import { EMemberRole } from '../../../types/workspace.type'
import MemberControl from '../MemberControl'
import UserCombobox from '../UserCombobox'

type TForm = Omit<TTeamDto, 'channelTitles'> & {
  channels?: { title: string }[]
}

const Channels = ({ control }: { control: Control<TForm, any> }) => {
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'channels'
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
          name={`channels.${index}.title`}
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
                  variant='transparent'
                  className='bg-gray-100'
                  onClick={() => remove(index)}
                >
                  <IconX size={16} />
                </ActionIcon>
              }
              classNames={{
                input: 'border border-dashed'
              }}
              error={fieldState.error && fieldState.error.message}
            />
          )}
        />
      ))}
      <div className='mt-2 flex justify-end'>
        <Button
          size='sm'
          variant='light'
          onClick={() => {
            append({
              title: ''
            })
          }}
        >
          Add Channel
        </Button>
      </div>
    </Checkbox.Group>
  )
}

const Members = ({ control }: { control: Control<TForm, any> }) => {
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'members'
  })

  return (
    <>
      <UserCombobox
        usersSelectedId={fields?.map(e => e.userId) || []}
        onPick={userId => {
          const idx = fields?.findIndex(e => e.userId === userId)
          if (idx < 0) {
            append({
              userId,
              role: EMemberRole.Member
            })
          } else {
            remove(idx)
          }
        }}
        textInputProps={{
          label: 'Add Members',
          description: 'Type to search and add members to the team',
          placeholder: 'Search and select members...',
          className: 'mt-2'
        }}
      />

      <div className='relative flex-1'>
        <ScrollArea className='absolute inset-0 mt-2' scrollbarSize={8}>
          {fields?.map((member, index) => (
            <Controller
              key={member.id}
              control={control}
              name={`members.${index}.role`}
              render={({ field: { value, onChange } }) => (
                <MemberControl
                  member={{ ...member, role: value }}
                  onChange={role => {
                    onChange(role)
                  }}
                  onRemove={() => {
                    remove(index)
                  }}
                />
              )}
            />
          ))}
        </ScrollArea>
      </div>
    </>
  )
}

export default function CreateTeam({
  onClose,
  isOpen,
  defaultValues
}: {
  isOpen: boolean
  onClose: () => void
  refetchKey?: string
  defaultValues?: DefaultValues<TForm>
}) {
  const { control, handleSubmit, reset } = useForm<TForm>({
    defaultValues
  })
  const { mutateAsync: createTeam, isPending } = useAppMutation('createTeam')

  useEffect(() => {
    isOpen && reset(defaultValues)
  }, [isOpen])

  return (
    <Drawer
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create Team</p>}
      overlayProps={{
        color: '#000',
        backgroundOpacity: 0.2,
        blur: 0.5
      }}
      classNames={{
        content: 'rounded-lg flex flex-col',
        inner: 'p-3',
        body: 'flex flex-col flex-1'
      }}
    >
      {/* <DropAvt /> */}
      <Controller
        control={control}
        name='title'
        rules={{
          required: 'Team name is required'
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <TextInput
            data-autofocus
            withAsterisk
            label='Team Name'
            placeholder='Enter the team name'
            // description='Leave it blank to use the default name...'
            size='sm'
            value={value}
            onChange={e => onChange(e.target.value)}
            error={fieldState.error && fieldState.error.message}
          />
        )}
      />

      <Controller
        control={control}
        name='description'
        render={({ field: { value, onChange } }) => (
          <Textarea
            label='Team Description'
            // description='Description for the team'
            placeholder='Enter a description for the team...'
            className='mt-2'
            value={value}
            onChange={e => onChange(e.target.value)}
          />
        )}
      />

      <Channels control={control} />

      <Members control={control} />

      <div className='mt-2 flex items-center justify-end gap-3'>
        <Button variant='default' color='red'>
          Close
        </Button>

        <Button
          loading={isPending}
          disabled={isPending}
          onClick={handleSubmit(({ channels, ...data }) => {
            createTeam({
              url: {
                baseUrl: '/workspace/teams'
              },
              method: 'post',
              payload: { ...data, channelTitles: channels?.map(e => e.title) }
            }).then(data => {
              console.log(data)
              onClose()
            })
          })}
        >
          Create
        </Button>
      </div>
    </Drawer>
  )
}
