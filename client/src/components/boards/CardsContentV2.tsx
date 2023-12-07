import { ActionIcon, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import useAppParams from '../../hooks/useAppParams'
import useRenderCount from '../../hooks/useRenderCount'
import { useAppSelector } from '../../redux/store'
import { EFieldType } from '../../services/apis/board/board.api'
import { useAppMutation } from '../../services/apis/useAppMutation'
import CardOptions from './CardOptions'
import DetailCard from './DetailCard'

export default function CardsContentV2() {
  useRenderCount('CardsContent')
  const [cardOpenId, setCardOpenId] = useState<string>()
  const { mutateAsync: createCard } = useAppMutation('createCard')
  const { boardId } = useAppParams()
  const propertyRoot = useAppSelector(state =>
    Object.values(state.workspace.properties)
      .filter(e => e.boardId === boardId)
      .find(
        ({ fieldType, fieldOption }) =>
          fieldType === EFieldType.Select &&
          fieldOption &&
          fieldOption.length > 3
      )
  )

  return (
    <>
      <div className='relative flex-1'>
        <ScrollArea
          className='absolute inset-0 cursor-pointer'
          scrollbarSize={8}
        >
          <div className='flex gap-3 p-3'>
            {propertyRoot?.fieldOption?.map(option => (
              <div className='w-72' key={option._id}>
                <div className='flex items-center justify-between bg-fuchsia-300 px-2 py-1'>
                  <span>{option.title}</span>
                  <ActionIcon
                    variant='transparent'
                    aria-label='Settings'
                    className='h-[30px] w-[30px] bg-gray-100 text-gray-600'
                    onClick={() => {
                      const timeStamp = new Date().getMilliseconds()
                      createCard({
                        url: {
                          baseUrl: '/workspace/boards/:boardId/cards',
                          urlParams: {
                            boardId: boardId!
                          }
                        },
                        method: 'post',
                        payload: {
                          title: 'anything bro' + timeStamp,
                          data: {
                            [propertyRoot._id]: option._id
                          }
                        }
                      })
                    }}
                  >
                    <IconPlus size={16} stroke={1.5} />
                  </ActionIcon>
                </div>
                <CardOptions
                  propertyId={propertyRoot._id}
                  optionId={option._id}
                />
              </div>
            ))}

            <div className='w-72'>
              <div className='flex items-center justify-between bg-fuchsia-300 px-2 py-1'>
                <span>Orther</span>
                <ActionIcon
                  variant='transparent'
                  aria-label='Settings'
                  className='h-[30px] w-[30px] bg-gray-100 text-gray-600'
                  onClick={() => {
                    const timeStamp = new Date().getMilliseconds()
                    createCard({
                      url: {
                        baseUrl: '/workspace/boards/:boardId/cards',
                        urlParams: {
                          boardId: boardId!
                        }
                      },
                      method: 'post',
                      payload: {
                        title: 'anything bro' + timeStamp,
                        data: {}
                      }
                    })
                  }}
                >
                  <IconPlus size={16} stroke={1.5} />
                </ActionIcon>
              </div>
              <CardOptions />
            </div>
          </div>
        </ScrollArea>
      </div>
      <DetailCard cardId={cardOpenId} />
    </>
  )
}
