type TKanban = {
  title: string
  id: string
  cards: { title: string; id: string; description: string }[]
}[]

const kanbanData: TKanban = []

const numColumns = 7
const numCardsPerColumn = 30

for (let columnId = 1; columnId <= numColumns; columnId++) {
  const columnTitle = `Column ${columnId}`
  const columnIdString = columnId.toString()
  const column: {
    title: string
    id: string
    cards: { title: string; id: string; description: string }[]
  } = {
    title: columnTitle,
    id: columnIdString,
    cards: []
  }

  for (let cardId = 1; cardId <= numCardsPerColumn; cardId++) {
    const cardTitle = `Card ${cardId}`
    const cardIdString = cardId.toString()
    column.cards.push({
      title: cardTitle,
      id: cardIdString,
      description:
        Math.random() > 0.5
          ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
          : 'Etiam luctus tempus turpis, sed eleifend lectus. Nullam ornare, tellus et consectetur interdum'
    })
  }

  kanbanData.push(column)
}

export default kanbanData
