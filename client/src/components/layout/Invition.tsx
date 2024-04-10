import { Button, Image } from '@mantine/core'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'
import { TMemberExtra } from '../../types'

export default function Invition({ invition }: { invition: TMemberExtra }) {
  const { mutateAsync: acceptInvition, isPending: acceptInvitionLoading } =
    useAppMutation('acceptInvition')
  const { mutateAsync: declineInvition, isPending: declineInvitionLoading } =
    useAppMutation('declineInvition')

  return (
    <div className='mt-2 cursor-pointer rounded p-2 text-sm transition-colors first:mt-0'>
      {invition.workspace?.thumbnail && (
        <Image
          loading='lazy'
          src={invition.workspace?.thumbnail.path}
          alt={invition.workspace?.thumbnail.path}
          className='aspect-video rounded'
        />
      )}
      <div>
        <span className='font-semibold'>{invition.createdBy?.userName}</span>
        <span>{` invite you to ${invition.workspace.type} `}</span>
        <span className='font-semibold'>{invition.workspace?.title}</span>
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
