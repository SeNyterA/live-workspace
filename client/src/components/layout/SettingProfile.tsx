import { Avatar, Loader, Textarea, TextInput } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'
import { TUser } from '../../types'

const Field = ({
  isDisabled,
  name,
  value,
  isTextArea
}: {
  isDisabled?: boolean
  value?: string
  name: keyof TUser
  isTextArea?: boolean
}) => {
  const { mutateAsync: updateProfile, isPending } =
    useAppMutation('updateProfile')

  return (
    <>
      {isTextArea ? (
        <Textarea
          withAsterisk
          disabled={isPending || isDisabled}
          label={name}
          placeholder={`Enter the team ${name}`}
          size='sm'
          className='mt-4'
          classNames={{
            input:
              ' disabled:opacity-100    border-gray-100/20 focus:border-gray-100/40'
          }}
          defaultValue={value}
          key={value}
          onBlur={e =>
            e.target.value !== value &&
            updateProfile({
              method: 'patch',
              url: {
                baseUrl: `auth/profile`
              },
              payload: { [name]: e.target.value }
            })
          }
          rightSection={isPending && <Loader size={14} />}
        />
      ) : (
        <TextInput
          withAsterisk
          disabled={isPending || isDisabled}
          label={name}
          placeholder={`Enter the team ${name}`}
          size='sm'
          className='mt-4'
          classNames={{
            input:
              ' disabled:opacity-100    border-gray-100/20 focus:border-gray-100/40'
          }}
          defaultValue={value}
          key={value}
          onBlur={e =>
            e.target.value !== value &&
            updateProfile({
              method: 'patch',
              url: {
                baseUrl: `auth/profile`
              },
              payload: { [name]: e.target.value }
            })
          }
          rightSection={isPending && <Loader size={14} />}
        />
      )}
    </>
  )
}

const WorkspaceAvatar = ({
  isDisabled,
  user
}: {
  isDisabled: boolean
  user?: TUser
}) => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )
  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  const { mutateAsync: uploadFile, isPending: uploadPending } = useAppMutation(
    'uploadFile',
    {
      config: {
        headers: {
          'Content-Type': undefined
        }
      },
      mutationOptions: {
        onSuccess(data, variables, context) {
          updateWorkspace({
            method: 'patch',
            url: {
              baseUrl: `workspaces/:workspaceId`,
              urlParams: {
                workspaceId: workspace?.id!
              }
            },
            payload: { workspace: { avatarId: data.id } as any }
          })
        }
      }
    }
  )
  const avatar = useAppSelector(
    state => state.workspace.files[workspace?.avatarId!]
  )

  return (
    <div className='flex items-center gap-2'>
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
              onSuccess(data, variables, context) {}
            }
          )
        }
        multiple={false}
        onReject={files => console.log('rejected files', files)}
        maxSize={3 * 1024 * 1024}
        accept={IMAGE_MIME_TYPE}
        className='mt-4'
        classNames={{
          inner: 'flex gap-2'
        }}
        disabled={isPending || isDisabled || uploadPending}
      >
        <Avatar
          classNames={{ placeholder: 'rounded-full' }}
          src={avatar?.path}
          className='rounded-full'
          size={100}
        />
      </Dropzone>
      <div>
        <p>{user?.userName}</p>
      </div>
    </div>
  )
}

export default function SettingProfile() {
  const user = useAppSelector(state => state.auth.userInfo)
  return (
    <>
      <WorkspaceAvatar isDisabled={false} user={user} />
      <Field name='nickName' value={user?.nickName} />
      <Field name='email' value={user?.email} isDisabled />
      <Field name='userName' value={user?.userName} isDisabled />
    </>
  )
}
