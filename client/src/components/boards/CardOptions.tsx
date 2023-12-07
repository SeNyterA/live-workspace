import useAppParams from '../../hooks/useAppParams'
import { useAppSelector } from '../../redux/store'
import CardItem from './card/CardItem'

export default function CardOptions({
  optionId,
  propertyId
}: {
  propertyId?: string
  optionId?: string
}) {
  const { boardId } = useAppParams()
  const cards = useAppSelector(state =>
    Object.values(state.workspace.cards).filter(
      card =>
        card.boardId === boardId &&
        (!!optionId && !!propertyId ? card.data[propertyId] === optionId : true)
    )
  )

  return <>{cards?.map(card => <CardItem key={card._id} card={card} />)}</>
}
