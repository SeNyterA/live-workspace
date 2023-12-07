import { Button, Checkbox, Divider, Modal, Select } from '@mantine/core'
import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { EBlockType } from '../../types/workspace.type'

export default function DetailCard({
  cardId,
  onclose
}: {
  cardId?: string
  onclose: () => void
}) {
  const { boardId } = useAppParams()
  const card = useAppSelector(state =>
    Object.values(state.workspace.cards).find(e => e._id === cardId)
  )

  const properties = useAppSelector(state =>
    Object.values(state.workspace.properties).filter(e => e.boardId === boardId)
  )

  const { mutateAsync: createBlock } = useAppMutation('createBlock')
  const { mutateAsync: updateCard } = useAppMutation('updateCard')

  return (
    <Modal
      onClose={onclose}
      opened={!!cardId}
      title={<p className='text-lg font-semibold'>{card?.title}</p>}
      size={'100%'}
    >
      <div className='flex gap-4'>
        <div className='w-80'>
          {properties?.map(property => (
            <Select
              className='first:!mt-0'
              key={property._id}
              label={property.title}
              description={property.description}
              placeholder='Pick value'
              data={property.fieldOption?.map(option => ({
                value: option._id,
                label: option.title
              }))}
              mt='md'
              value={card?.data[property._id]?.toString() || ''}
              onChange={value => {
                updateCard({
                  url: {
                    baseUrl: '/workspace/boards/:boardId/cards/:cardId',
                    urlParams: {
                      boardId: boardId!,
                      cardId: cardId!
                    }
                  },
                  method: 'patch',
                  payload: {
                    data: {
                      ...card?.data,
                      [property._id]: value
                    }
                  }
                })
              }}
            />
          ))}
        </div>
        <Divider orientation='vertical' />
        <div className='w-full'>
          <span className='text-base'>description</span>
          {card?.blocks.map(block => {
            switch (block.blockType) {
              case EBlockType.Text:
                return <p>{block.content}</p>
              case EBlockType.Checkbox:
                return (
                  <Checkbox
                    className='my-2'
                    checked={block.isCheck}
                    label={block.content}
                  />
                )
              case EBlockType.Divider:
                return <Divider className='my-3' />
            }
            return <></>
          })}

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
          </div>
        </div>
      </div>
    </Modal>
  )
}
