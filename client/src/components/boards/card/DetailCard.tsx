import { Button, Divider, Modal, ScrollArea, Select } from '@mantine/core'
import { useState } from 'react'
import useAppControlParams from '../../../hooks/useAppControlParams'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/useAppMutation'
import { EBlockType, TCard, TProperty } from '../../../types/workspace.type'
import Block from './Block'

const SelectField = ({
  property,
  card
}: {
  property: TProperty
  card?: TCard
}) => {
  const { boardId } = useAppParams()
  const { mutateAsync: updateCard, isPending } = useAppMutation('updateCard')
  const [tmpValue, setTmpValue] = useState<string | undefined | null>()

  return (
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
      disabled={isPending}
      value={isPending ? tmpValue : card?.data[property._id]?.toString()}
      onChange={value => {
        setTmpValue(value)
        updateCard({
          url: {
            baseUrl: '/workspace/boards/:boardId/cards/:cardId',
            urlParams: {
              boardId: boardId!,
              cardId: card?._id!
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
  )
}

export default function DetailCard() {
  const { toogleCard } = useAppControlParams()
  const { boardId, cardId } = useAppParams()
  const card = useAppSelector(state =>
    Object.values(state.workspace.cards).find(e => e._id === cardId)
  )
  const properties = useAppSelector(state =>
    Object.values(state.workspace.properties).filter(e => e.boardId === boardId)
  )
  const { mutateAsync: createBlock } = useAppMutation('createBlock')
  const { mutateAsync: uploadFile } = useAppMutation('uploadFile', {
    headers: {
      'Content-Type': undefined
    }
  })

  return (
    <>
      {!!cardId && !!card && (
        <Modal
          onClose={() => {
            toogleCard({})
          }}
          opened={true}
          title={<p className='text-lg font-semibold'>{card.title}</p>}
          size='100%'
          classNames={{
            content: 'h-full flex flex-col',
            body: 'flex-1'
          }}
          overlayProps={{
            color: '#000',
            backgroundOpacity: 0.35,
            blur: 15
          }}
        >
          <div className='flex h-full gap-4'>
            <div className='relative w-80'>
              <ScrollArea className='absolute inset-0' scrollbarSize={8}>
                {properties?.map(property => (
                  <SelectField
                    key={property._id}
                    card={card}
                    property={property}
                  />
                ))}
              </ScrollArea>
            </div>
            <Divider orientation='vertical' />
            <div className='flex flex-1 flex-col'>
              <span className='text-base'>description</span>

              <div className='relative flex-1 text-sm'>
                <ScrollArea className='absolute inset-0' scrollbarSize={8}>
                  {card.blocks.map(block => (
                    <Block block={block} key={block._id} />
                  ))}
                  <div>
                    <Button
                      onClick={() => {
                        createBlock({
                          method: 'post',
                          url: {
                            baseUrl:
                              '/workspace/boards/:boardId/cards/:cardId/blocks',
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
                            baseUrl:
                              '/workspace/boards/:boardId/cards/:cardId/blocks',
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
                            baseUrl:
                              '/workspace/boards/:boardId/cards/:cardId/blocks',
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
                      onChange={e => {
                        const selectedFile = e.target.files?.[0]

                        if (selectedFile) {
                          const formData = new FormData()
                          formData.append('file', selectedFile)

                          uploadFile({
                            method: 'post',
                            url: {
                              baseUrl: '/upload'
                            },
                            payload: formData
                          })
                            .then(data => {
                              console.log(data)
                            })
                            .catch(error => {
                              console.error('File upload failed', error)
                            })
                        }
                      }}
                    />
                    <label htmlFor='uploadImage_cardDetail'>Image</label>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
