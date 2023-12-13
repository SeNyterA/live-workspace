import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import CardItem from './card/CardItem'

export default function CardOptions({
  optionId,
  propertyId
}: {
  propertyId: string
  optionId?: string
}) {
  const { boardId } = useAppParams()

  console.log(boardId)
  const cards = useAppSelector(state =>
    Object.values(state.workspace.cards).filter(
      card => card.boardId === boardId && card.data?.[propertyId] === optionId
    )
  )

  return <>{cards?.map(card => <CardItem key={card._id} card={card} />)}</>
}
