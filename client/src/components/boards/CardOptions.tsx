import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import CardItem from './card/CardItem'

export default function CardOptions({
  optionId,
  propertyId,
  optionsId
}: {
  propertyId: string
  optionId?: string
  optionsId?: string[]
}) {
  const { boardId } = useAppParams()

  const cards = useAppSelector(state =>
    Object.values(state.workspace.cards).filter(card =>
      card.boardId === boardId && !!optionsId
        ? !optionsId.includes(card.data?.[propertyId] as any)
        : card.data?.[propertyId] === optionId
    )
  )

  return <>{cards?.map(card => <CardItem key={card._id} card={card} />)}</>
}
