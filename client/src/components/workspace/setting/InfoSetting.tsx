import {
  Avatar,
  Group,
  Input,
  Loader,
  Radio,
  ScrollArea,
  Textarea,
  TextInput
} from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useAppSelector } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { EMemberRole, EWorkspaceStatus, EWorkspaceType } from '../../../types'

const Title = ({ isDisabled }: { isDisabled: boolean }) => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )

  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  return (
    <TextInput
      // data-autofocus
      withAsterisk
      disabled={isPending || isDisabled}
      label={`${workspace?.type} name`}
      placeholder='Enter the team name'
      size='sm'
      className='mt-4'
      defaultValue={workspace?.title}
      key={workspace?.title}
      onBlur={e =>
        e.target.value !== workspace?.title &&
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: { workspaceId: workspace?.id! }
          },
          payload: { workspace: { title: e.target.value } as any }
        })
      }
      rightSection={isPending && <Loader size={14} />}
    />
  )
}

const Description = ({ isDisabled }: { isDisabled: boolean }) => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )

  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  return (
    <Textarea
      placeholder='Enter a description...'
      className='mt-4'
      defaultValue={workspace?.description}
      key={workspace?.description}
      // data-autofocus
      withAsterisk
      disabled={isPending || isDisabled}
      label={`${workspace?.type} description`}
      size='sm'
      onBlur={e =>
        e.target.value !== workspace?.description &&
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: { workspaceId: workspace?.id! }
          },
          payload: { workspace: { description: e.target.value } as any }
        })
      }
      rightSection={isPending && <Loader size={14} />}
    />
  )
}

const DisplayUrl = ({ isDisabled }: { isDisabled: boolean }) => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )

  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  return (
    <TextInput
      // data-autofocus
      withAsterisk
      label='Dispay url'
      placeholder='Enter the display url'
      description='This is the url that will be used to access the team. e.g. .../teams/your-team-name'
      size='sm'
      className='mt-4'
      defaultValue={workspace?.displayUrl}
      disabled={isPending || isDisabled}
      key={workspace?.displayUrl}
      onBlur={e =>
        e.target.value !== workspace?.displayUrl &&
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: { workspaceId: workspace?.id! }
          },
          payload: { workspace: { displayUrl: e.target.value } as any }
        })
      }
      rightSection={isPending && <Loader size={14} />}
    />
  )
}

const Thunmbnail = ({ isDisabled }: { isDisabled: boolean }) => {
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
            payload: { workspace: { thumbnail: data } as any }
          })
        }
      }
    }
  )

  return (
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
                // setValue('thumbnail', data)
              }
            }
          )
        }
        multiple={false}
        onReject={files => console.log('rejected files', files)}
        maxSize={3 * 1024 * 1024}
        accept={IMAGE_MIME_TYPE}
        className='mt-4 w-full'
        disabled={isPending || isDisabled || uploadPending}
      >
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.thumbnail?.path}
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
  )
}

const WorkspaceStatus = ({ isDisabled }: { isDisabled: boolean }) => {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )
  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')

  return (
    <Radio.Group
      name='status'
      label='Select the status for this workspace'
      description='This will determine who can access this workspace'
      withAsterisk
      className='mt-4'
      value={workspace?.status}
      onChange={value =>
        updateWorkspace({
          method: 'patch',
          url: {
            baseUrl: `workspaces/:workspaceId`,
            urlParams: {
              workspaceId: workspace?.id!
            }
          },
          payload: { workspace: { status: value } as any }
        })
      }
    >
      <Group mt='xs'>
        <Radio
          value={EWorkspaceStatus.Private}
          label={EWorkspaceStatus.Private}
          labelPosition='right'
          classNames={{
            body: 'flex gap-1',
            description: 'mt-0',
            inner: 'order-[0]'
          }}
          description='Members are added manually.'
          disabled={isPending || isDisabled}
        />
        <Radio
          value={EWorkspaceStatus.Public}
          label={EWorkspaceStatus.Public}
          labelPosition='right'
          classNames={{
            body: 'flex gap-1',
            description: 'mt-0',
            inner: 'order-[0]'
          }}
          description='Members are added automatically.'
          disabled={isPending || isDisabled}
        />
      </Group>
    </Radio.Group>
  )
}

const WorkspaceAvatar = ({ isDisabled }: { isDisabled: boolean }) => {
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
            payload: { workspace: { avatar: data } as any }
          })
        }
      }
    }
  )

  return (
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
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.avatar?.path}
          className='h-32 w-32 rounded-lg'
        />
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.avatar?.path}
          className='h-24 w-24 rounded-lg'
        />
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.avatar?.path}
          className='h-16 w-16 rounded-lg'
        />
        <Avatar
          classNames={{ placeholder: 'rounded-lg' }}
          src={workspace?.avatar?.path}
          className='!h-8 !w-8 rounded-lg'
          size={32}
        />
      </Dropzone>
      <Input.Description className=''>
        This image is used for avatar
      </Input.Description>
    </>
  )
}

export default function InfoSetting() {
  const workspace = useAppSelector(
    state => state.workspace.workspaces[state.workspace.workspaceSettingId!]
  )
  const enabled = useAppSelector(state =>
    Object.values(state.workspace.members).find(
      member =>
        member.userId === state.auth.userInfo?._id &&
        [EMemberRole.Owner, EMemberRole.Admin].includes(member.role)
    )
  )

  return (
    <ScrollArea
      className='absolute inset-0 right-[-12px] pr-3'
      scrollbarSize={8}
    >
      <Thunmbnail isDisabled={!enabled} />

      <WorkspaceAvatar isDisabled={!enabled} />

      <Title isDisabled={!enabled} />

      <DisplayUrl isDisabled={!enabled} />

      <Description isDisabled={!enabled} />

      {[EWorkspaceType.Board, EWorkspaceType.Channel].includes(
        workspace?.type as EWorkspaceType
      ) && <WorkspaceStatus isDisabled={!enabled} />}
    </ScrollArea>
  )
}
