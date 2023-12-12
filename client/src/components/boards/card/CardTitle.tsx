import { TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import useAppParams from '../../../hooks/useAppParams'
import { useAppSelector } from '../../../redux/store'
import { useAppMutation } from '../../../services/apis/useAppMutation'

export default function CardTitle() {
  const { boardId, cardId } = useAppParams()
  const card = useAppSelector(state => state.workspace.cards[cardId || ''])
  const { mutateAsync: updateCard } = useAppMutation('updateCard')
  const [value, setValue] = useState('')

  useEffect(() => {
    card?.title && setValue(card.title)
  }, [card?.title])

  return (
    <TextInput
      placeholder='Pick value'
      className='w-full px-0'
      classNames={{
        input:
          'border bg-transparent border-transparent outline-none w-full focus:border-b-blue-400 hover:border-b-blue-400 border-dashed resize-none text-lg px-0 w-full truncate'
      }}
      value={value}
      onBlur={() => {
        value !== card?.title &&
          updateCard({
            url: {
              baseUrl: '/workspace/boards/:boardId/cards/:cardId',
              urlParams: {
                boardId: boardId!,
                cardId: cardId!
              }
            },
            method: 'patch',
            payload: { title: value }
          })
      }}
      onChange={e => {
        setValue(e.target.value)
      }}
    />
  )
}
