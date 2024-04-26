import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform
} from 'framer-motion'
import { useRef } from 'react'

export default function Exprience() {
  const targetRef = useRef(null)
  const viewPortRef = useRef(null)
  const { scrollYProgress, scrollY } = useScroll({
    target: targetRef,
    container: viewPortRef,
    offset: ['start end', 'end start'],
    layoutEffect: false
  })

  const y = useTransform(scrollY, y => -y)

  useMotionValueEvent(scrollY, 'change', latest => {
    console.log(latest)
  })

  return (
    <div className='absolute flex inset-0 snap-y overflow-y-scroll' ref={viewPortRef}>
      <motion.div className='flex-1 space-y-2' ref={targetRef}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div className='flex h-[840px] snap-center items-center justify-center bg-slate-300'>
            {i + 1}
          </div>
        ))}
      </motion.div>
      <div className='sticky top-0 h-full flex-1 bg-black'>
        <motion.div
          className='absolute inset-x-0 bottom-0 flex-1 space-y-2'
          style={{
            bottom: y
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div className='flex h-[840px] items-center justify-center bg-blue-300'>
              {i + 1}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
