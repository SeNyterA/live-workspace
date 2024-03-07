import { Button, Image } from '@mantine/core'
import { useAppMutation } from '../../services/apis/mutations/useAppMutation'
import { TMember } from '../../types'

export default function Invition({ invition }: { invition: TMember }) {
  const { mutateAsync: acceptInvition, isPending: acceptInvitionLoading } =
    useAppMutation('acceptInvition')
  const { mutateAsync: declineInvition, isPending: declineInvitionLoading } =
    useAppMutation('declineInvition')

  return (
    <div className='cursor-pointer rounded bg-gray-100 p-2 text-sm transition-colors hover:bg-gray-100 mt-2 first:mt-0'>
      <div>
        <span className='font-semibold'>{invition.createdBy?.userName}</span>
        <span> invite you to </span>
        <span className='font-semibold'>{invition.workspace?.title}</span>
      </div>

      {invition.workspace?.thumbnail && (
        <Image
          src={invition.workspace?.thumbnail.path}
          alt={invition.workspace?.title}
          className='aspect-video rounded'
        />
      )}

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
                baseUrl: '/workspace/:workspaceId/accept-invition',
                urlParams: {
                  workspaceId: invition.targetId
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
                baseUrl: '/workspace/:workspaceId/decline-invition',
                urlParams: {
                  workspaceId: invition.targetId
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
