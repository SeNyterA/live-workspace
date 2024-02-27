import { Button, ScrollArea } from '@mantine/core'
import useAppParams from '../../../hooks/useAppParams'
import { useAppMutation } from '../../../services/apis/mutations/useAppMutation'
import { EBlockType, TCard } from '../../../types/workspace.type'
import Block from './Block'
import BlockActions from './BlockActions'

export default function Descriptions({ card }: { card: TCard }) {
  const { boardId, cardId } = useAppParams()
  const { mutateAsync: createBlock } = useAppMutation('createBlock')
  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    config: {
      headers: {
        'Content-Type': undefined
      }
    }
  })

  return (
    <ScrollArea
      className='absolute inset-0 left-[-12px] right-[-12px] px-3'
      scrollbarSize={8}
    >
      {card.blocks.map(block => (
        <Block block={block} key={block._id} />
      ))}

      <BlockActions />

      <div>
        <Button
          onClick={() => {
            createBlock({
              method: 'post',
              url: {
                baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks',
                urlParams: {
                  boardId: boardId!,
                  cardId: cardId!
                },
                queryParams: {
                  index: -1
                }
              },
              payload: {
                blockType: EBlockType.Text,
                content: 'anything ahahhahaha',
                isCheck: false
              }
            })
          }}
        >
          Text
        </Button>
        <Button
          onClick={() => {
            createBlock({
              method: 'post',
              url: {
                baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks',
                urlParams: {
                  boardId: boardId!,
                  cardId: cardId!
                },
                queryParams: {
                  index: -1
                }
              },
              payload: {
                blockType: EBlockType.Checkbox,
                content: 'anything ahahhahaha',
                isCheck: false
              }
            })
          }}
        >
          Checkbox
        </Button>
        <Button
          onClick={() => {
            createBlock({
              method: 'post',
              url: {
                baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks',
                urlParams: {
                  boardId: boardId!,
                  cardId: cardId!
                },
                queryParams: {
                  index: -1
                }
              },

              payload: {
                blockType: EBlockType.Divider,
                content: 'anything ahahhahaha',
                isCheck: false
              }
            })
          }}
        >
          Divider
        </Button>

        <input
          id='uploadImage_cardDetail'
          type='file'
          value=''
          multiple
          onChange={async e => {
            const files = e.target.files

            if (files) {
              const urls: string[] = []
              const uploadPromises = Array.from(files).map(file => {
                const formData = new FormData()
                formData.append('file', file)

                return uploadFile({
                  method: 'post',
                  isFormData: true,
                  url: {
                    baseUrl: '/upload'
                  },
                  payload: { file }
                })
                  .then(data => {
                    urls.push(data.url)
                  })
                  .catch(error => {
                    console.error('File upload failed', error)
                  })
              })

              await Promise.all(uploadPromises)

              createBlock({
                method: 'post',
                url: {
                  baseUrl: '/workspace/boards/:boardId/cards/:cardId/blocks',
                  urlParams: {
                    boardId: boardId!,
                    cardId: cardId!
                  },
                  queryParams: {
                    index: -1
                  }
                },
                payload: {
                  blockType: EBlockType.Files,
                  files: urls
                }
              })
            }
          }}
        />
        <label htmlFor='uploadImage_cardDetail'>Image</label>
      </div>
    </ScrollArea>
  )
}
