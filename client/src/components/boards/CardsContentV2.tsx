import { ActionIcon, ScrollArea } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import useAppControlParams from '../../hooks/useAppControlParams'
import useRenderCount from '../../hooks/useRenderCount'
import { useAppSelector } from '../../redux/store'
import { EFieldType } from '../../services/apis/board/board.api'
import { useAppMutation } from '../../services/apis/useAppMutation'
import { useBoard } from './BoardProvider'
import CardOptions from './CardOptions'

type TOption = { _id: string; title: string; color?: string }

export default function CardsContentV2() {
  useRenderCount('CardsContent')
  const { trackingId, boardId } = useBoard()
  const { toogleCard } = useAppControlParams()
  const { mutateAsync: createCard } = useAppMutation('createCard')

  const propertyRoot = useAppSelector(
    state => state.workspace.properties[trackingId!]
  )

  const memberUsers = useAppSelector(state =>
    Object.values(state.workspace.members)
      .filter(e => e.targetId === boardId)
      .map(member => ({
        member,
        user: state.workspace.users[member.userId]
      }))
  )

  const getOptions = (): TOption[] | undefined => {
    switch (propertyRoot?.fieldType) {
      case EFieldType.Select:
        return propertyRoot?.fieldOption || []
      case EFieldType.People:
        return memberUsers
          ?.filter(e => !!e.user)
          .map(e => ({ _id: e.user._id, title: e.user.userName }))
      default:
        return []
    }
  }

  const options = getOptions() || []

  return (
    <>
      {propertyRoot && (
        <div className='relative flex-1'>
          <ScrollArea
            className='absolute inset-0 cursor-pointer'
            scrollbarSize={8}
          >
            <div className='flex gap-3 p-3'>
              {options.map(option => (
                <div className='w-64' key={option._id}>
                  <div className='flex h-9 items-center justify-between rounded bg-gray-100 px-2'>
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
                        }).then(data => {
                          console.log(data)
                          if (data.data?._id) {
                            toogleCard({
                              cardId: data.data._id
                            })
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

              <div className='w-64'>
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
                <CardOptions
                  propertyId={propertyRoot?._id || ''}
                  optionsId={propertyRoot?.fieldOption?.map(e => e._id) || []}
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  )
}
