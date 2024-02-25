import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import './MentionList.scss'
import { Avatar } from '@mantine/core'

export default forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  console.log({ first: props.items })

  const selectItem = index => {
    const item = props.items[index]
    if (item) {
      props.command({ id: item._id, label: item.userName })
    }
  }

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    )
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    }
  }))

  return (
    <div className='items'>
      {props.items.length ? (
        props.items.map((user, index) => (
          <button
            className={`item flex cursor-pointer gap-1 ${
              index === selectedIndex ? 'ring-1' : ''
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div
              className='mt-2 flex max-w-full flex-1 items-center gap-1 first:mt-0'
              key={user?._id}
            >
              <Avatar src={user?.avatar} size={32} className='' />

              <div className='flex flex-1 flex-col justify-center'>
                <p className='max-w-[250px] truncate font-medium leading-4'>
                  {user?.userName}
                </p>
                <p className='leading-2 max-w-[250px] truncate text-xs text-gray-500'>
                  {user?.email}
                </p>
              </div>
            </div>
          </button>
        ))
      ) : (
        <div className='item'>No result</div>
      )}
    </div>
  )
})
