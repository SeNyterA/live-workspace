import { Button } from '@mantine/core'
import { useDispatch } from 'react-redux'
import { workspaceActions } from '../../redux/slices/workspace.slice'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'
import { extractApi, TMember } from '../../types'

export default function Invition({ invition }: { invition: TMember }) {
  const dispatch = useDispatch()
  const workspace = useAppSelector(
    state => state.workspace.workspaces[invition.workspaceId]
  )
  const { mutateAsync: acceptInvition, isPending: acceptInvitionLoading } =
    useAppMutation('acceptInvition', {
      mutationOptions: {
        onSuccess(data, variables, context) {
          dispatch(
            workspaceActions.updateWorkspaceStore(
              extractApi({
                ...data
              })
            )
          )
        }
      }
    })

  const { mutateAsync: declineInvition, isPending: declineInvitionLoading } =
    useAppMutation('declineInvition')

  return (
    <div className='mt-2 cursor-pointer rounded p-2 text-sm transition-colors first:mt-0'>
      {/* {invition.workspace?.thumbnail && (
        <Image
          loading='lazy'
          src={invition.workspace?.thumbnail.path}
          alt={invition.workspace?.thumbnail.path}
          className='aspect-video rounded'
        />
      )} */}
      <div>
        {/* <span className='font-semibold'>{createdBy?.userName}</span> */}
        <span>{` invite you to ${workspace?.type} `}</span>
        <span className='font-semibold'>{workspace?.title}</span>
      </div>

      <div className='mt-2'>
        <Button
          size='xs'
          color='blue'
          className='mr-2'
          disabled={acceptInvitionLoading || declineInvitionLoading}
          loading={acceptInvitionLoading}
          onClick={() => {
            acceptInvition({
              method: 'post',
              url: {
                baseUrl: '/workspaces/:workspaceId/accept-invition',
                urlParams: {
                  workspaceId: invition.workspaceId
                }
              }
            })
          }}
        >
          Accept
        </Button>

        <Button
          disabled={acceptInvitionLoading || declineInvitionLoading}
          size='xs'
          color='red'
          loading={declineInvitionLoading}
          onClick={() => {
            declineInvition({
              method: 'post',
              url: {
                baseUrl: '/workspaces/:workspaceId/decline-invition',
                urlParams: {
                  workspaceId: invition.workspaceId
                }
              }
            })
          }}
        >
          Decline
        </Button>
      </div>
    </div>
  )
}
