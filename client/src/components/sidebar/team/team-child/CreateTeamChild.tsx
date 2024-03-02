import {
  Avatar,
  Button,
  Drawer,
  Input,
  ScrollArea,
  Tabs,
  Textarea,
  TextInput
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { Controller, DefaultValues, useForm } from 'react-hook-form'
import {
  ApiMutationType,
  useAppMutation
} from '../../../../services/apis/mutations/useAppMutation'
import { WorkspaceType } from '../../../../types'
import { Members } from './Members'

export type TCreateChildForm =
  | ApiMutationType['createBoard']['payload']
  | ApiMutationType['createChannel']['payload']

const targetName = {
  [WorkspaceType.Board]: 'board',
  [WorkspaceType.Channel]: 'channel'
}
export default function CreateTeamChild({
  onClose,
  isOpen,
  defaultValues,
  type
}: {
  isOpen: boolean
  onClose: () => void
  defaultValues?: DefaultValues<TCreateChildForm>
  type: WorkspaceType.Board | WorkspaceType.Channel
}) {
  const { control, handleSubmit, setValue } = useForm<TCreateChildForm>({
    defaultValues
  })

  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    }
  })
  const _targetName = targetName[type]
  return (
    <Drawer
      onClose={onClose}
      opened={isOpen}
      title={<p className='text-lg font-semibold'>Create {_targetName}</p>}
      overlayProps={{
        color: '#000',
        backgroundOpacity: 0.2,
        blur: 0.5
      }}
      classNames={{
        content: 'rounded-lg flex flex-col',
        inner: 'p-3',
        body: 'flex flex-col flex-1 relative text-sm'
      }}
      size={400}
      position={'left'}
    >
      <Tabs
        defaultValue='info'
        classNames={{
          root: 'h-full flex flex-col',
          panel: 'flex-1'
        }}
      >
        <Tabs.List>
          <Tabs.Tab value='info'>Infomation</Tabs.Tab>
          <Tabs.Tab value='members'>Members</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='info' className='relative'>
          <ScrollArea
            className='absolute inset-0 right-[-12px] pr-3'
            scrollbarSize={8}
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
                    className='mt-4 w-full'
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
                    className='mt-4'
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
                required: `${_targetName} is required`
              }}
              render={({ field: { value, onChange }, fieldState }) => (
                <TextInput
                  data-autofocus
                  withAsterisk
                  label={`${_targetName} name`}
                  placeholder='Enter the team name'
                  size='sm'
                  className='mt-4'
                  classNames={{ label: 'capitalize' }}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  error={fieldState.error && fieldState.error.message}
                />
              )}
            />

            <Controller
              control={control}
              name='workspace.displayUrl'
              render={({ field: { value, onChange }, fieldState }) => (
                <TextInput
                  data-autofocus
                  withAsterisk
                  label='Dispay url'
                  placeholder='Enter the display url'
                  description={`e.g. ...teams/team-url/channels/${
                    value || 'channel-name'
                  }`}
                  size='sm'
                  className='mt-4'
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
                  className='mt-4'
                  value={value}
                  onChange={e => onChange(e.target.value)}
                />
              )}
            />
          </ScrollArea>
        </Tabs.Panel>
        <Tabs.Panel value='members' className='relative'>
          <ScrollArea
            className='absolute inset-0 right-[-12px] pr-3'
            scrollbarSize={8}
          >
            <Members control={control} />
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>

      <div className='mt-4 flex items-center justify-end gap-3'>
        <Button variant='default' color='red'>
          Close
        </Button>

        <Button
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
