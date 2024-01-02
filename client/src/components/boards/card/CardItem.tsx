import { IconCheckbox } from '@tabler/icons-react'
import useAppControlParams from '../../../hooks/useAppControlParams'
import { getAppValue } from '../../../redux/store'
import { EFieldType } from '../../../services/apis/board/board.api'
import { TCard } from '../../../types/workspace.type'
import { getItemsWithMatchingKey } from '../../../utils/helper'

export default function CardItem({ card }: { card: TCard }) {
  const { toogleCard } = useAppControlParams()
  const checkboxes = getItemsWithMatchingKey(card.data || {}, 'taskItem')

  const sss = getAppValue(state => {
    const _properties = Object.values(state.workspace.properties).filter(
      e => e.boardId === card.boardId
    )
    const _cardProperties = card.properties
    _properties.map(property => property.fieldOption)

    const _membersId: string[] = []
    try {
      _properties
        .filter(property =>
          [EFieldType.Assignees, EFieldType.MultiPeople].includes(
            property.fieldType
          )
        )
        .forEach(e => _membersId.push(...card.properties![e._id]!))

      _properties
        .filter(property => [EFieldType.People].includes(property.fieldType))
        .forEach(e => _membersId.push(card.properties![e._id]! as string))
    } catch (err) {}

    console.log(_membersId)

    return {
      members: _properties.filter(property =>
        [EFieldType.Assignees, EFieldType.MultiPeople].includes(
          property.fieldType
        )
      )
    }
  })
  return (
    <div
      className='flex min-h-[80px] flex-col rounded bg-gray-100 px-2 py-1'
      id={card._id}
      onClick={() => {
        toogleCard({
          cardId: card._id
        })
      }}
    >
      <p className='line-clamp-3 flex-1'>{card.title}</p>
      <div className='flex items-center text-gray-600'>
        {`${checkboxes.filter(e => e.attrs && e.attrs['checked']).length}/${
          checkboxes.length
        }`}{' '}
        <IconCheckbox size={16} />
      </div>
    </div>
  )
}
