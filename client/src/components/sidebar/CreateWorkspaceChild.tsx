import {
  Avatar,
  Button,
  Drawer,
  Group,
  Input,
  Radio,
  ScrollArea,
  Textarea,
  TextInput
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import {
  Control,
  Controller,
  DefaultValues,
  useFieldArray,
  useForm
} from 'react-hook-form'
import {
  ApiMutationType,
  useAppMutation
} from '../../services/apis/mutations/useAppMutation'
import { EMemberRole, WorkspaceType } from '../../types'
import MemberControl from './MemberControl'
import UserCombobox from './UserCombobox'

type TForm =
  | ApiMutationType['createBoard']['payload']
  | ApiMutationType['createChannel']['payload']

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

export default function CreateWorkspaceChild({
  onClose,
  isOpen,
  defaultValues,
  type
}: {
  isOpen: boolean
  onClose: () => void
  defaultValues?: DefaultValues<TForm>
  type: WorkspaceType
}) {
  const { control, handleSubmit, reset, setValue } = useForm<TForm>({
    defaultValues
  })

  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    }
  })

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
            name='workspace.thumbnail'
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
                          setValue('workspace.thumbnail', data)
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
                <Input.Description className='mt-1'>
                  This image is used for thumbnail
                </Input.Description>
              </>
            )}
          />

          <Controller
            control={control}
            name='workspace.avatar'
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
                          setValue('workspace.avatar', data)
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
            name='workspace.title'
            rules={{
              required: 'Team name is required'
            }}
            render={({ field: { value, onChange }, fieldState }) => (
              <TextInput
                data-autofocus
                withAsterisk
                label='Team Name'
                placeholder='Enter the team name'
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
            name='workspace.displayUrl'
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
            name='workspace.description'
            render={({ field: { value, onChange } }) => (
              <Textarea
                label='Team Description'
                placeholder='Enter a description for the team...'
                className='mt-2'
                value={value}
                onChange={e => onChange(e.target.value)}
              />
            )}
          />

          <Radio.Group
            name='favoriteFramework'
            label='Select your favorite framework/library'
            description='This is anonymous'
            withAsterisk
            className='mt-4'
          >
            <Group mt='xs'>
              <Radio
                value='private'
                label='Private'
                classNames={{
                  body: 'flex gap-1 flex-row-reverse',
                  description: 'mt-0'
                }}
                description='Only members can access'
              />
              <Radio
                value='public'
                label='Public'
                classNames={{
                  body: 'flex gap-1 flex-row-reverse',
                  description: 'mt-0'
                }}
                description='Invite all team members to join'
              />
            </Group>
          </Radio.Group>

          <Members control={control} />
        </ScrollArea>
      </div>

      <div className='mt-2 flex items-center justify-end gap-3'>
        <Button variant='default' color='red'>
          Close
        </Button>

        <Button
          // loading={isPending}
          // disabled={isPending}
          onClick={handleSubmit(({ ...data }) => {
            console.log({ data }, {})
          })}
        >
          Create
        </Button>
      </div>
    </Drawer>
  )
}
