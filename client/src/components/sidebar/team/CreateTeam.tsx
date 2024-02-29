import {
  ActionIcon,
  Avatar,
  Button,
  Checkbox,
  Drawer,
  Input,
  ScrollArea,
  Textarea,
  TextInput
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconHash, IconX } from '@tabler/icons-react'
import { useEffect } from 'react'
import {
  Control,
  Controller,
  DefaultValues,
  useFieldArray,
  useForm
} from 'react-hook-form'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { TFile, TMember } from '../../../types'
import MemberControl from '../MemberControl'
import UserCombobox from '../UserCombobox'

type TForm = {
  channels?: { title: string }[]
  boards?: { title: string; isInitData: boolean }[]
  displayUrl: string
  thumbnail?: TFile
  avatar?: TFile
  title: string
  description?: string
  members?: TMember[]
  dispayName: string
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

const Boards = ({ control }: { control: Control<TForm, any> }) => {
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'boards'
  })

  return (
    <Checkbox.Group
      label='Init boards'
      description='Members will be added when created.'
      className='mt-2'
    >
      {fields?.map((_, index) => (
        <>
          <Controller
            key={_.id}
            control={control}
            name={`boards.${index}.title`}
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
        </>
      ))}
      <div className='mt-2 flex justify-end'>
        <Button
          size='sm'
          variant='light'
          onClick={() => {
            append({ isInitData: true, title: '' })
          }}
        >
          Add board
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
            } as any)
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
  const { control, handleSubmit, reset, setValue } = useForm<TForm>({
    defaultValues
  })
  const { mutateAsync: createTeam, isPending } = useAppMutation('createTeam')

  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    }
  })

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
        body: 'flex flex-col flex-1 overflow-y-hidden'
      }}
      size={400}
    >
      <div className='relative flex-1'>
        <ScrollArea
          scrollbarSize={8}
          className='absolute inset-0 right-[-12px] pr-3'
        >
          <Controller
            control={control}
            name='thumbnail'
            render={({ field: { value, onChange } }) => (
              <>
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
                          setValue('thumbnail', data)
                        }
                      }
                    )
                  }
                  multiple={false}
                  onReject={files => console.log('rejected files', files)}
                  maxSize={3 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  className='w-full'
                >
                  <Avatar
                    classNames={{ placeholder: 'rounded-lg' }}
                    src={value?.path}
                    className='h-40 w-full flex-1 rounded-lg border bg-gray-50'
                    alt='Team thumbnail'
                  >
                    Team thumbnail
                  </Avatar>
                </Dropzone>
                <Input.Description className=''>
                  This image is used for thumbnail
                </Input.Description>
              </>
            )}
          />

          <Controller
            control={control}
            name='avatar'
            render={({ field: { value, onChange } }) => (
              <>
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
                          setValue('avatar', data)
                        }
                      }
                    )
                  }
                  multiple={false}
                  onReject={files => console.log('rejected files', files)}
                  maxSize={3 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  className='mt-2'
                  classNames={{
                    inner: 'flex gap-2'
                  }}
                >
                  <Avatar
                    classNames={{ placeholder: 'rounded-lg' }}
                    src={value?.path}
                    className='h-32 w-32 rounded-lg'
                  />
                  <Avatar
                    classNames={{ placeholder: 'rounded-lg' }}
                    src={value?.path}
                    className='h-24 w-24 rounded-lg'
                  />
                  <Avatar
                    classNames={{ placeholder: 'rounded-lg' }}
                    src={value?.path}
                    className='h-16 w-16 rounded-lg'
                  />
                  <Avatar
                    classNames={{ placeholder: 'rounded-lg' }}
                    src={value?.path}
                    className='!h-8 !w-8 rounded-lg'
                    size={32}
                  />
                </Dropzone>
                <Input.Description className=''>
                  This image is used for avatar
                </Input.Description>
              </>
            )}
          />

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
                className='mt-2'
                value={value}
                onChange={e => onChange(e.target.value)}
                error={fieldState.error && fieldState.error.message}
              />
            )}
          />

          <Controller
            control={control}
            name='dispayName'
            rules={{
              required: 'Display name is required'
            }}
            render={({ field: { value, onChange }, fieldState }) => (
              <TextInput
                data-autofocus
                withAsterisk
                label='Dispay url'
                placeholder='Enter the display url'
                description='This is the url that will be used to access the team. e.g. .../teams/your-team-name'
                size='sm'
                className='mt-2'
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

          <Boards control={control} />

          <Members control={control} />
        </ScrollArea>
      </div>

      <div className='mt-2 flex items-center justify-end gap-3'>
        <Button variant='default' color='red'>
          Close
        </Button>

        <Button
          loading={isPending}
          disabled={isPending}
          onClick={handleSubmit(({ ...data }) => {
            console.log({ data }, {})

            createTeam({
              url: {
                baseUrl: '/teams'
              },
              method: 'post',
              payload: {
                workspace: {
                  title: data.title,
                  avatar: data.avatar,
                  thumbnail: data.thumbnail,
                  description: data.description
                } as any,
                channels: data.channels?.map(e => ({
                  title: e.title
                })) as any[],
                members: data.members?.map(e => ({
                  userId: e.userId,
                  role: e.role
                })) as any[],
                boards: data.boards?.map(e => ({
                  title: e.title
                })) as any[]
              }
            }).then(data => {
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
