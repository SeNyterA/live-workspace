import { Avatar, Input } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import useAppParams from '../../../../hooks/useAppParams'
import Watching from '../../../../redux/Watching'
import { useAppMutation } from '../../../../services/apis/mutations/useAppMutation'

const Thunmbnail = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { cardId, boardId } = useAppParams()

  const { mutateAsync: updateWorkspace, isPending } =
    useAppMutation('updateWorkspace')
  const { mutateAsync: updateCard } = useAppMutation('updateCard')

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
          updateCard({
            method: 'patch',
            url: {
              baseUrl: 'boards/:boardId/cards/:cardId',
              urlParams: {
                cardId: cardId!,
                boardId: boardId!
              }
            },
            payload: { card: { thumbnailId: data.id } as any }
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
        className='w-full'
        disabled={isPending || isDisabled || uploadPending}
      >
        <Watching
          watchingFn={state => {
            const thumbnail =
              state.workspace.files[state.workspace.cards[cardId!].thumbnailId!]

            return thumbnail
          }}
        >
          {thumbnail => {
            return (
              <Avatar
                classNames={{ placeholder: 'rounded-lg' }}
                src={thumbnail?.path}
                className='h-40 w-full flex-1 rounded-lg border'
                alt='Team thumbnail'
              >
                Team thumbnail
              </Avatar>
            )
          }}
        </Watching>
      </Dropzone>
      <Input.Description className='mt-1'>
        This image is used for thumbnail
      </Input.Description>
    </>
  )
}

export default Thunmbnail
