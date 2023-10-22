import { Avatar, AvatarGroup, ScrollArea } from '@mantine/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import kanbanData from './data.test'

export default function CardsContent() {
  return (
    <div className='flex-1 relative'>
      <ScrollArea className='absolute inset-0' scrollbarSize={8}>
        <DragDropContext onDragEnd={e => console.log(e)}>
          <Droppable
            droppableId='all-droppables'
            direction='horizontal'
            type='column'
          >
            {provided => (
              <div
                className='flex'
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {kanbanData.map((column, index) => (
                  <Draggable
                    draggableId={column.id}
                    index={index}
                    key={column.id}
                  >
                    {provided => (
                      <div
                        className='mx-2 rounded w-64'
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div
                          className='px-2 py-1'
                          {...provided.dragHandleProps}
                        >
                          {column.title}
                        </div>
                        <div className='pb-3'>
                          {column.cards.map(card => (
                            <div
                              key={card.id}
                              className='mt-2 w-full p-2 bg-gray-50'
                            >
                              <p>{card.title}</p>
                              <p className='text-xs'>{card.description}</p>
                              <AvatarGroup>
                                {['A', 'B', 'C', 'D', 'E'].map(e => (
                                  <Avatar size='sm'>{e}</Avatar>
                                ))}
                              </AvatarGroup>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ScrollArea>
    </div>
  )
}
