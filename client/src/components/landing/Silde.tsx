import { motion, useMotionValue } from 'framer-motion'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

const imgs = [
  '/imgs/nature/1.jpg',
  '/imgs/nature/2.jpg',
  '/imgs/nature/3.jpg',
  '/imgs/nature/4.jpg',
  '/imgs/nature/5.jpg',
  '/imgs/nature/6.jpg',
  '/imgs/nature/7.jpg'
]

const ONE_SECOND = 1000
const AUTO_DELAY = ONE_SECOND * 10
const DRAG_BUFFER = 50

const SPRING_OPTIONS = {
  type: 'spring',
  mass: 3,
  stiffness: 400,
  damping: 50
}

export const SwipeCarousel = () => {
  const [imgIndex, setImgIndex] = useState(0)

  const dragX = useMotionValue(0)

  const onDragEnd = () => {
    const x = dragX.get()

    if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
      setImgIndex(pv => pv + 1)
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex(pv => pv - 1)
    }
  }

  return (
    <div className='relative overflow-hidden bg-neutral-950'>
      <motion.div
        drag='x'
        dragConstraints={{
          left: 0,
          right: 0
        }}
        style={{
          x: dragX
        }}
        animate={{
          translateX: `-${imgIndex * 100}%`
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className='flex cursor-grab items-center active:cursor-grabbing w-full h-full'
      >
        {imgs.map((imgSrc, idx) => {
          return (
            <motion.div
              key={idx}
              style={{
                backgroundImage: `url(${imgSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              animate={{
                scale: imgIndex === idx ? 0.95 : 0.9
              }}
              transition={SPRING_OPTIONS}
              className='aspect-video w-screen shrink-0 rounded-xl bg-neutral-800 object-cover'
            />
          )
        })}
      </motion.div>
    </div>
  )
}

