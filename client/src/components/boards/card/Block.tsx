import { Checkbox, Divider, Image, Input } from '@mantine/core'
import useAppParams from '../../../hooks/useAppParams'
import { useAppMutation } from '../../../services/apis/useAppMutation'
import { EBlockType, TBlock } from '../../../types/workspace.type'

export default function Block({ block }: { block: TBlock }) {
  const { mutateAsync: updateBlock } = useAppMutation('updateBlock')
  const { boardId, cardId } = useAppParams()
  return (
    <>
      {block.blockType === EBlockType.Checkbox && (
        <Checkbox
          key={block._id}
          className='my-2'
          checked={block.isCheck}
          classNames={{
            body: 'flex items-center',
            labelWrapper: 'flex-1'
          }}
          label={
            <Input
              unstyled
              classNames={{
                input:
                  'border border-transparent outline-none w-full focus:border-b-blue-400 hover:border-b-blue-400 border-dashed'
              }}
              key={block.content}
              placeholder='Checkbox placeholder'
              defaultValue={block.content}
              onBlur={e => {
                if (e.target.value !== block.content)
                  updateBlock({
                    url: {
                      baseUrl:
                        '/workspace/boards/:boardId/cards/:cardId/blocks/:blockId',
                      urlParams: {
                        boardId: boardId!,
                        cardId: cardId!,
                        blockId: block._id
                      }
                    },
                    method: 'patch',
                    payload: {
                      content: e.target.value
                    }
                  })
              }}
            />
          }
          onChange={e => {
            updateBlock({
              url: {
                baseUrl:
                  '/workspace/boards/:boardId/cards/:cardId/blocks/:blockId',
                urlParams: {
                  boardId: boardId!,
                  cardId: cardId!,
                  blockId: block._id
                }
              },
              method: 'patch',
              payload: {
                isCheck: e.target.checked
              }
            })
          }}
        />
      )}

      {block.blockType === EBlockType.Divider && (
        <Divider key={block._id} className='my-3' />
      )}

      {block.blockType === EBlockType.Text && (
        <Input
          className='my-2'
          unstyled
          classNames={{
            input:
              'border border-transparent outline-none w-full focus:border-b-blue-400 hover:border-b-blue-400 border-dashed'
          }}
          key={block.content}
          defaultValue={block.content}
          placeholder='Checkbox placeholder'
          onBlur={e => {
            if (e.target.value !== block.content)
              updateBlock({
                url: {
                  baseUrl:
                    '/workspace/boards/:boardId/cards/:cardId/blocks/:blockId',
                  urlParams: {
                    boardId: boardId!,
                    cardId: cardId!,
                    blockId: block._id
                  }
                },
                method: 'patch',
                payload: {
                  content: e.target.value
                }
              })
          }}
        />
      )}

      {block.blockType === EBlockType.Image && (
        <Image
          className='my-2'
          radius='md'
          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png'
          fit='contain'
        />
      )}
    </>
  )
}
